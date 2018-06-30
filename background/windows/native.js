/* eslint-env node */ /* eslint-disable strict */ 'use strict'; /* globals require, module, process, */ // This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.

/**
 * Global HotKey registration for Windows
 */

/**
 * Registers a global HotKey combination listener. Automatically starts polling for events.
 * @param  {string}    combo   Modifiers (in order OS, Ctrl, Alt, Shift) and key from `./keys.js` joined with '+'.
 * @param  {boolean}   repeat  Whether to repetitively fire while the key combo is kept pressed.
 * @param  {function}  action  Callback called with `combo` string when the OS reports the key combo.
 * @return {function}          Function that can be called (without arguments) to unregister the HotKey.
 * @throws {Error}             If the registration fails.
 */
function register(combo, repeat, action) {
	typeof combo !== 'string' && invalid();
	action = action.bind(null, combo); // throw if no function
	const match = (/^(OS ?\+ ?)?(Ctrl ?\+ ?)?(Alt ?\+ ?)?(Shift ?\+ ?)?([A-Za-z0-9]+)$/).exec(combo); !match && invalid();
	const [ , os, ctrl, alt, shift, keyName, ] = match;
	const key = KEYS[keyName]; !key && invalid();
	let mods = 0; os && (mods |= 8); ctrl && (mods |= 1); alt && (mods |= 1); shift && (mods |= 4); !repeat && (mods |= 16384);

	const id = ++count;
	if (!RegisterHotKey(null, id, mods, key)) { throw new Error('Failed to register HotKey'); }
	handlers.set(id, action); handlers.size === 1 && poll();

	return () => handlers.has(id) && !!UnregisterHotKey(null, id) && handlers.delete(id); // TODO: this can create a stupidly high number of noncollectable remote functions, might want to return a (random) id string/number instead
	function invalid() { throw new TypeError(`Invalid HotKey combo `+ JSON.stringify(combo)); }
} let count = 0; const handlers = new Map;

/**
 * Sets and gets the event polling interval.
 * @param  {number|null?}  value  `undefined` only gets, `null` resets, any number > 10 sets the time in ms.
 * @return {number}               The current interval value.
 */
function pollInterval(value) {
	if (value === undefined) { return interval; }
	if (value === null) { return (interval = 250); }
	if (typeof value === 'number' && value >= 10) { return (interval = value); }
	throw new TypeError('Poll interval must be a ms number > 10');
} let interval = 250;

module.exports = { register, pollInterval, };


/// start implementation

const KEYS = require('./keys.js'); // see for available keys

const {
	RegisterHotKey, UnregisterHotKey,
	PeekMessageA: PeekMessage,
	MSG, WM_HOTKEY,
} = require('./types.js');

const msg = new MSG, pmsg = msg.ref();

function poll() { try { // called when the first HotKey is registered
	if (!handlers.size) { return; }
	if (PeekMessage(pmsg, null, WM_HOTKEY, WM_HOTKEY, 1)) { // ffi constructs a new arguments and return buffer for every call, it should technically work to use the same buffers for all calls
		if (msg.message !== WM_HOTKEY) { throw new Error('Unexpected message type '+ msg.message); }
		(async () => handlers.get(msg.wParam)())()
		.catch(error => console.error('Error in HotKey handler', error));
		poll(); // immediately
	} else {
		setTimeout(poll, interval);
	}
} catch (error) { setTimeout(poll, interval); throw error; } }

// cleanup
process.on('exit', () => {
	for (const id of handlers.keys()) {
		UnregisterHotKey(null, id);
	}
});
