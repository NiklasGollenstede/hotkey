(function(global) { 'use strict'; define(async ({ // This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
}) => {

/*return [ {
	combos: [ [ 'Alt', 'Shift', 'KeyT', ], ], repeat: false,
	match: 'https://*.niklasg.de/*', which: 'first', open: null,
	code: `console.log('yay');`, when: 'document_end',
}, ];*/

return [ action(
		[ 'Alt', 'Shift', 'KeyK', ],
		`(document.querySelector(".spoticon-play-16") || document.querySelector(".spoticon-pause-16")).click()`,
), action(
		[ 'Alt', 'Shift', 'KeyJ', ],
		`document.querySelector(".spoticon-skip-back-16").click()`,
), action(
		[ 'Alt', 'Shift', 'KeyL', ],
		`document.querySelector(".spoticon-skip-forward-16").click()`,
), ];
// 'document.querySelector(".spoticon-shuffle-16").click()';
// 'document.querySelector(".spoticon-repeat-16").click()';

function action(combo, code) { return {
	combos: [ combo, ], repeat: false,
	match: 'https://*.spotify.com/*', which: 'first', open: null,
	code, when: 'document_end',
}; }

}); })(this);
