/* eslint-env node */ /* eslint-disable strict */ 'use strict'; /* global require, module, process, Buffer, */ // This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.

/**
 * Global HotKey registration (Windows only)
 */

/**
 * Registers a global HotKey combination listener. Automatically starts polling for events.
 * @param  {string}    key     Name of the key, see `./keys.js`.
 * @param  {[string]}  mods    Array of modifier key names.
 * @param  {function}  action  Callback called when the OS reports the key combo.
 * @return {function}          Function that can be called to unregister the HotKey.
 * @throws {Error}             If the registration fails.
 */
function register(key, mods, action) {
	const id = ++count;
	key = KEYS.key[key]; mods = (mods || [ ]).map(m => KEYS.mod[m]);
	if (typeof key !== 'number' || mods.some(m => typeof m !== 'number')) { throw new TypeError('Invalid HotKey combo'); }
	if (!RegisterHotKey(null, id, mods.reduce((a, b) => a | b), key)) { throw new Error('Failed to register HotKey'); }
	handlers.set(id, action); handlers.size === 1 && poll();
	return () => handlers.has(id) && !!UnregisterHotKey(null, id) && handlers.delete(id);
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
		call(handlers.get(msg.wParam));
		setTimeout(poll, 0); // immediately
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


/**
 * FFI type definitions, following the naming in the C headers.
 */

const KEYS = require('./windows-keys.js');
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
const msg = new MSG, pmsg = msg.ref();

const {
	RegisterHotKey, UnregisterHotKey,
	PeekMessageA: PeekMessage,
	// GetMessageA: GetMessage, SetTimer, KillTimer,
} = new (require('ffi').Library)('User32', {
	RegisterHotKey: [ BOOL, [ HWND, int, UINT, UINT, ], ],
	UnregisterHotKey: [ BOOL, [ HWND, int, ], ],
	PeekMessageA: [ BOOL, [ LPMSG, HWND, UINT, UINT, UINT, ], ],
	// GetMessageA: [ BOOL, [ LPMSG, HWND, UINT, UINT, ], ],
	// SetTimer: [ UINT_PTR, [ HWND, UINT_PTR, UINT, PVOID, ], ],
	// KillTimer: [ BOOL, [ HWND, UINT_PTR, ], ], // this doesn't work
});

async function call(handler) {
	try { handler && (await handler()); }
	catch (error) { console.error('Error in HotKey handler', error); }
}
