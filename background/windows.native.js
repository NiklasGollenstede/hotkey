/* eslint-env node */ /* eslint-disable strict */ 'use strict'; /* global require, module, process, Buffer, */ // This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.

/**
 * Global HotKey registration (Windows only)
 */

const KEYS = require('./windows-keys.js'); // see for available keys

/**
 * Registers a global HotKey combination listener. Automatically starts polling for events.
 * @param  {string}    combo   Modifiers (in order OS, Ctrl, Alt, Shift) and key from `./windows-keys.js` joined with '+'.
 * @param  {boolean}   repeat  Whether to repetitively fire while the key combo is kept pressed.
 * @param  {function}  action  Callback called with `combo` string when the OS reports the key combo.
 * @return {function}          Function that can be called (without arguments) to unregister the HotKey.
 * @throws {Error}             If the registration fails.
 */
function register(combo, repeat, action) {
	typeof combo !== 'string' && invalid();
	action = action.bind(null, combo); // throw if no function
	const match = (/^(OS\+)?(Ctrl\+)?(Alt\+)?(Shift\+)?([A-Za-z0-9]+)$/).exec(combo); !match && invalid();
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

function poll() { try {
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
	for (const id of handlers.kesy()) {
		UnregisterHotKey(null, id);
	}
});

module.exports = { register, pollInterval, };

// FFI native functions and types
const {
	RegisterHotKey, UnregisterHotKey,
	PeekMessageA: PeekMessage,
	MSG, WM_HOTKEY,
} = (() => { // Type definitions, following the naming in the C headers.

	const WM_HOTKEY = 0x0312;
	const _WIN64 = process.arch === 'x64';
	const { types, refType, } = require('ref'), Struct = require('ref-struct');
	const {
		int, uint, long, ulong,
		int64, uint64,
		int: BOOL, uint: UINT, long: LONG, /*ulong: ULONG,*/
	} = types;
	const PVOID = refType(types.void), HANDLE = PVOID, HWND = HANDLE;
	const UINT_PTR = _WIN64 ? uint64 : uint, WPARAM = UINT_PTR;
	const LONG_PTR  = _WIN64 ? int64 : long, LPARAM = LONG_PTR;
	const DWORD = ulong;

	const MSG = Struct({
		hwnd: HWND,
		message: UINT,
		wParam: WPARAM,
		lParam: LPARAM,
		time: DWORD,
		pt: Struct({ x: LONG, y: LONG, }),
	}), LPMSG = refType(MSG);

	return Object.assign({
		MSG, WM_HOTKEY,
	}, new (require('ffi').Library)('User32', {
		RegisterHotKey: [ BOOL, [ HWND, int, UINT, UINT, ], ],
		UnregisterHotKey: [ BOOL, [ HWND, int, ], ],
		PeekMessageA: [ BOOL, [ LPMSG, HWND, UINT, UINT, UINT, ], ],
		// GetMessageA: [ BOOL, [ LPMSG, HWND, UINT, UINT, ], ],
		// SetTimer: [ UINT_PTR, [ HWND, UINT_PTR, UINT, PVOID, ], ],
		// KillTimer: [ BOOL, [ HWND, UINT_PTR, ], ], // this doesn't work
	}));

})(); // end typedefs

const msg = new MSG, pmsg = msg.ref(); // must create these down here after the typedefs
