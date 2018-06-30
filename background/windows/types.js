/* eslint-env node */ /* eslint-disable strict */ 'use strict'; /* globals require, exports, process, */ // This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.

/**
 * FFI native functions and types
 * The type names are intentionally close to the names in C.
 */

const WM_HOTKEY = 0x0312;
const _WIN64 = process.arch === 'x64';
{ process.argv[0] = process.argv0; /* bugfix for native-ext v0.3.1 */ }
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

Object.assign(exports, new (require('ffi').Library)('User32', {
	RegisterHotKey: [ BOOL, [ HWND, int, UINT, UINT, ], ],
	UnregisterHotKey: [ BOOL, [ HWND, int, ], ],
	PeekMessageA: [ BOOL, [ LPMSG, HWND, UINT, UINT, UINT, ], ],
	// GetMessageA: [ BOOL, [ LPMSG, HWND, UINT, UINT, ], ],
	// SetTimer: [ UINT_PTR, [ HWND, UINT_PTR, UINT, PVOID, ], ],
	// KillTimer: [ BOOL, [ HWND, UINT_PTR, ], ], // this doesn't work
}));

exports.MSG = MSG;
exports.WM_HOTKEY = WM_HOTKEY;
