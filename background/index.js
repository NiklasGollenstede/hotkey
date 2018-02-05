(function(global) { 'use strict'; define(async ({ // This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
	'node_modules/web-ext-utils/browser/': { Tabs, },
	'node_modules/web-ext-utils/browser/storage': Storage,
	'node_modules/web-ext-utils/utils/': { reportError, /*reportSuccess,*/ },
	'node_modules/native-ext/': Native,
	'common/options': options,
	Handlers,
	module, require,
}) => {

// handle uncaught exceptions/rejections in the native modules to prevent the process from exiting
Native.onUncaughtException(error => { reportError('Unhandled error in native code', error); /*Native.nuke();*/ });
Native.onUnhandledRejection(error => { reportError('Unhandled rejection in native code', error); /*Native.nuke();*/ });

(await new Promise(done => global.setTimeout(done, 2000))); // wait for previous process to exit

const HotKeys = (await Native.require(require.resolve('./windows.native.js')));

false && Handlers.forEach(({ combos, repeat, match, which, open, code, }) => combos.forEach(mods => {
	HotKeys.register(mods[mods.length - 1], mods.slice(0, -1).concat(
		repeat === false ? 'MOD_NOREPEAT' : [ ]
	), async () => {
		let tabs = (await Tabs.query({ url: match, }));
		if (tabs.length) { switch (which) {
			case 'first': tabs = [ tabs[0], ]; break;
			case 'last': tabs = [ tabs.pop(), ]; break;
		} } else {
			if (!open) { return; }
			tabs = [ (await Tabs.create({ url: open, })), ];
		}
		(await Promise.all(tabs.map(tab => Tabs.executeScript(tab.id, { code, runAt: 'document_start', }))));
	}).catch(error => reportError('Failed to register HotKey', mods.join('+'), error));
}));

global.addEventListener('unload', () => Native.nuke());

// HotKeys.register('KeyB', [ 'Alt', ], () => reportSuccess('Keypress', 'Alt+B'));
// HotKeys.register('KeyC', [ 'Alt', ], () => reportError('Keypress', 'Alt+C'));

// debug stuff
Object.assign(global, module.exports = {
	Browser: require('node_modules/web-ext-utils/browser/'), Storage,
	options,
	Native,
	HotKeys,
});

}); })(this);
