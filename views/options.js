(function(global) { 'use strict'; define(async ({ // This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
	'node_modules/web-ext-utils/browser/version': { current: browser, },
	'node_modules/web-ext-utils/options/editor/inline': Inline,
	'node_modules/web-ext-utils/utils/notify': notify,
	'node_modules/native-ext/': Native,
}) => async window => { const { document, } = window;

document.body.innerHTML = `
	<style>
		h2 { font-weight: 400; font-size 120%; }
		#todo:not(.active), #done:not(.active) { display: none; }
		p { margin: .4em -.5em .2em; padding: .1em .5em 0.3em; } #error { background: yellow; }
	</style>
	<div id=todo class=active>
		<h2>NativeExt Setup</h2>
		<p>To catch keypresses system-wide, needs access to the NativeExt extension.</p>
		<p>Please <a href id=extension target=_blank>install</a> the NativeExt extension and follow its setup instructions,
			then click this <button id=request>Request Permission</button> button.</p>
		<p id=error style="display: none">Error: <span id=message></span></p>
	</div><div id=done>
		<p>NativeExt is connected. <small><a href id=instructions>Show instructions anyway.</a></small></p>
	</div>
	<h2>Options</h2>
`;

const todo = document.querySelector('#todo'), done = document.querySelector('#done');
function show(section) { document.querySelectorAll('.active').forEach(_=>_.classList.remove('active')); section.classList.add('active'); }
if ((await Native.getApplicationName({ stale: null, }))) { show(done); }
document.querySelector('#instructions').onclick = e => { if(!e.button) { show(todo); e.preventDefault(); } };

document.querySelector('#extension').href = Native.extensionInstallPage(browser);

document.querySelector('#request').onclick = async e => { if(!e.button) { try {
	notify.info('Requesting permission', `To proceed, please click "Allow" in the popup window.`);
	const reply = (await Native.requestPermission({
		message: `reStyle needs access to the NativeExt to load local styles and apply styles to the browser UI of Firefox.`,
	})); if (reply.failed) { throw new Error(reply.message); }
	show(done);
	notify.success('Access granted');
	document.querySelector('#error').style.display = 'none';
	document.querySelector('#message').textContent = '';
} catch (error) {
	notify.error(error);
	document.querySelector('#error').style.display = 'block';
	document.querySelector('#message').textContent = error.message;
} } };

(await Inline(window));

/*function uid() { return Array.from(
	global.crypto.getRandomValues(new Uint8Array(12)),
	_=>_.toString(16).padStart(2, '0'),
).join(''); }*/

}); })(this);
