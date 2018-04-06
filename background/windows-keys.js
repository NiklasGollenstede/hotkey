(function(global) { 'use strict'; const factory = function winapi_keys(exports) { // license: MIT

return { // TODO: should only expose the 2nd column
	VK_LBUTTON: 1,               //
	VK_RBUTTON: 2,               //
	VK_CANCEL: 3,                //
	VK_MBUTTON: 4,               //
	VK_XBUTTON1: 5,              //
	VK_XBUTTON2: 6,              //
	VK_BACK: 8,                  Backspace: 8,
	VK_TAB: 9,                   Tab: 9,
	VK_CLEAR: 12,                //
	VK_RETURN: 13,               Enter: 13,
	VK_PAUSE: 19,                Pause: 19,
	VK_CAPITAL: 20,              //
	VK_KANA: 21,                 //
	VK_JUNJA: 23,                //
	VK_FINAL: 24,                //
	VK_KANJI: 25,                //
	VK_ESCAPE: 27,               Escape: 27,
	VK_CONVERT: 28,              //
	VK_NONCONVERT: 29,           //
	VK_ACCEPT: 30,               //
	VK_MODECHANGE: 31,           //
	VK_SPACE: 32,                Space: 32,
	VK_PRIOR: 33,                PageUp: 33, // ?
	VK_NEXT: 34,                 PageDown: 34, // ?
	VK_END: 35,                  End: 35,
	VK_HOME: 36,                 Home: 36,
	VK_LEFT: 37,                 ArrowLeft: 37,
	VK_UP: 38,                   ArrowUp: 38,
	VK_RIGHT: 39,                ArrowRight: 39,
	VK_DOWN: 40,                 ArrowDown: 40,
	VK_SELECT: 41,               //
	VK_PRINT: 42,                PrintScreen: 42, // ?
	VK_EXECUTE: 43,              //
	VK_SNAPSHOT: 44,             //
	VK_INSERT: 45,               Insert: 45,
	VK_DELETE: 46,               Delete: 46,
	VK_HELP: 47,                 Help: 47,
	VK_KEY_0: 48,                Digit0: 48,
	VK_KEY_1: 49,                Digit1: 49,
	VK_KEY_2: 50,                Digit2: 50,
	VK_KEY_3: 51,                Digit3: 51,
	VK_KEY_4: 52,                Digit4: 52,
	VK_KEY_5: 53,                Digit5: 53,
	VK_KEY_6: 54,                Digit6: 54,
	VK_KEY_7: 55,                Digit7: 55,
	VK_KEY_8: 56,                Digit8: 56,
	VK_KEY_9: 57,                Digit9: 57,
	VK_KEY_A: 65,                KeyA: 65,
	VK_KEY_B: 66,                KeyB: 66,
	VK_KEY_C: 67,                KeyC: 67,
	VK_KEY_D: 68,                KeyD: 68,
	VK_KEY_E: 69,                KeyE: 69,
	VK_KEY_F: 70,                KeyF: 70,
	VK_KEY_G: 71,                KeyG: 71,
	VK_KEY_H: 72,                KeyH: 72,
	VK_KEY_I: 73,                KeyI: 73,
	VK_KEY_J: 74,                KeyJ: 74,
	VK_KEY_K: 75,                KeyK: 75,
	VK_KEY_L: 76,                KeyL: 76,
	VK_KEY_M: 77,                KeyM: 77,
	VK_KEY_N: 78,                KeyN: 78,
	VK_KEY_O: 79,                KeyO: 79,
	VK_KEY_P: 80,                KeyP: 80,
	VK_KEY_Q: 81,                KeyQ: 81,
	VK_KEY_R: 82,                KeyR: 82,
	VK_KEY_S: 83,                KeyS: 83,
	VK_KEY_T: 84,                KeyT: 84,
	VK_KEY_U: 85,                KeyU: 85,
	VK_KEY_V: 86,                KeyV: 86,
	VK_KEY_W: 87,                KeyW: 87,
	VK_KEY_X: 88,                KeyX: 88,
	VK_KEY_Y: 89,                KeyY: 89,
	VK_KEY_Z: 90,                KeyZ: 90,
	VK_LWIN: 91,                 OSLeft: 91,
	VK_RWIN: 92,                 OSRight: 92,
	VK_APPS: 93,                 //
	VK_SLEEP: 95,                //
	VK_NUMPAD0: 96,              Numpad0: 96,
	VK_NUMPAD1: 97,              Numpad1: 97,
	VK_NUMPAD2: 98,              Numpad2: 98,
	VK_NUMPAD3: 99,              Numpad3: 99,
	VK_NUMPAD4: 100,             Numpad4: 100,
	VK_NUMPAD5: 101,             Numpad5: 101,
	VK_NUMPAD6: 102,             Numpad6: 102,
	VK_NUMPAD7: 103,             Numpad7: 103,
	VK_NUMPAD8: 104,             Numpad8: 104,
	VK_NUMPAD9: 105,             Numpad9: 105,
	VK_MULTIPLY: 106,            //
	VK_ADD: 107,                 //
	VK_SEPARATOR: 108,           //
	VK_SUBTRACT: 109,            Minus: 109, // ?
	VK_DECIMAL: 110,             Period:110,
	VK_DIVIDE: 111,              Slash: 111,
	VK_F1: 112,                  F1: 112,
	VK_F2: 113,                  F2: 113,
	VK_F3: 114,                  F3: 114,
	VK_F4: 115,                  F4: 115,
	VK_F5: 116,                  F5: 116,
	VK_F6: 117,                  F6: 117,
	VK_F7: 118,                  F7: 118,
	VK_F8: 119,                  F8: 119,
	VK_F9: 120,                  F9: 120,
	VK_F10: 121,                 F10: 121,
	VK_F11: 122,                 F11: 122,
	VK_F12: 123,                 F12: 123,
	VK_F13: 124,                 F13: 124,
	VK_F14: 125,                 F14: 125,
	VK_F15: 126,                 F15: 126,
	VK_F16: 127,                 F16: 127,
	VK_F17: 128,                 F17: 128,
	VK_F18: 129,                 F18: 129,
	VK_F19: 130,                 F19: 130,
	VK_F20: 131,                 F20: 131,
	VK_F21: 132,                 F21: 132,
	VK_F22: 133,                 F22: 133,
	VK_F23: 134,                 F23: 134,
	VK_F24: 135,                 F24: 135,
	VK_NUMLOCK: 144,             //
	VK_SCROLL: 145,              //
	VK_OEM_FJ_JISHO: 146,        //
	VK_OEM_FJ_MASSHOU: 147,      //
	VK_OEM_FJ_TOUROKU: 148,      //
	VK_OEM_FJ_LOYA: 149,         //
	VK_OEM_FJ_ROYA: 150,         //
	VK_LSHIFT: 160,              ShiftLeft: 160,
	VK_RSHIFT: 161,              ShiftRight: 161,
	VK_LCONTROL: 162,            ControlLeft: 162,
	VK_RCONTROL: 163,            ControlRight: 163,
	VK_LMENU: 164,               //
	VK_RMENU: 165,               //
	VK_BROWSER_BACK: 166,        BrowserBack: 166,
	VK_BROWSER_FORWARD: 167,     BrowserForward: 167,
	VK_BROWSER_REFRESH: 168,     BrowserRefresh: 168,
	VK_BROWSER_STOP: 169,        BrowserStop: 169,
	VK_BROWSER_SEARCH: 170,      BrowserSearch: 170,
	VK_BROWSER_FAVORITES: 171,   BrowserFavorites: 171,
	VK_BROWSER_HOME: 172,        BrowserHome: 172,
	VK_VOLUME_MUTE: 173,         VolumeMute: 173,
	VK_VOLUME_DOWN: 174,         VolumeDown: 174,
	VK_VOLUME_UP: 175,           VolumeUp: 175,
	VK_MEDIA_NEXT_TRACK: 176,    MediaTrackNext: 176,
	VK_MEDIA_PREV_TRACK: 177,    MediaTrackPrevious: 177,
	VK_MEDIA_STOP: 178,          MediaStop: 178,
	VK_MEDIA_PLAY_PAUSE: 179,    MediaPlayPause: 179,
	VK_LAUNCH_MAIL: 180,         LaunchMail: 180,
	VK_LAUNCH_MEDIA_SELECT: 181, MediaSelect: 181, // ?
	VK_LAUNCH_APP1: 182,         LaunchApp1: 182,
	VK_LAUNCH_APP2: 183,         LaunchApp2: 183,
	VK_OEM_1: 186,               //
	VK_OEM_PLUS: 187,            //
	VK_OEM_COMMA: 188,           //
	VK_OEM_MINUS: 189,           //
	VK_OEM_PERIOD: 190,          //
	VK_OEM_2: 191,               //
	VK_OEM_3: 192,               //
	VK_ABNT_C1: 193,             //
	VK_ABNT_C2: 194,             //
	VK_OEM_4: 219,               //
	VK_OEM_5: 220,               //
	VK_OEM_6: 221,               //
	VK_OEM_7: 222,               //
	VK_OEM_8: 223,               //
	VK_OEM_AX: 225,              //
	VK_OEM_102: 226,             //
	VK_ICO_HELP: 227,            //
	VK_ICO_00: 228,              //
	VK_PROCESSKEY: 229,          //
	VK_ICO_CLEAR: 230,           //
	VK_PACKET: 231,              //
	VK_OEM_RESET: 233,           //
	VK_OEM_JUMP: 234,            //
	VK_OEM_PA1: 235,             //
	VK_OEM_PA2: 236,             //
	VK_OEM_PA3: 237,             //
	VK_OEM_WSCTRL: 238,          //
	VK_OEM_CUSEL: 239,           //
	VK_OEM_ATTN: 240,            //
	VK_OEM_FINISH: 241,          //
	VK_OEM_COPY: 242,            //
	VK_OEM_AUTO: 243,            //
	VK_OEM_ENLW: 244,            //
	VK_OEM_BACKTAB: 245,         //
	VK_ATTN: 246,                //
	VK_CRSEL: 247,               //
	VK_EXSEL: 248,               //
	VK_EREOF: 249,               //
	VK_PLAY: 250,                //
	VK_ZOOM: 251,                //
	VK_NONAME: 252,              //
	VK_PA1: 253,                 //
	VK_OEM_CLEAR: 254,           //
	VK__none_: 255,              //
};

}; if (typeof define === 'function' && define.amd) { define([ 'exports', ], factory); } else { const exp = { }, result = factory(exp) || exp; if (typeof exports === 'object' && typeof module === 'object') { module.exports = result; } else { global[factory.name] = result; } } })((function() { return this; })()); // eslint-disable-line
