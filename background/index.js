(function(global) { 'use strict'; define(async ({ // This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
	'node_modules/web-ext-utils/browser/': { Tabs, },
	'node_modules/web-ext-utils/utils/': { reportError, /*reportSuccess,*/ },
	'node_modules/native-ext/': Native,
	'common/options': options,
	Handlers,
	module,
	require,
}) => {

// handle uncaught exceptions/rejections in the native modules to prevent the process from exiting
Native.onUncaughtException(error => { reportError('Unhandled error in native code', error); /*Native.nuke();*/ });
Native.onUnhandledRejection(error => { reportError('Unhandled rejection in native code', error); /*Native.nuke();*/ });

(await new Promise(done => global.setTimeout(done, 2000))); // wait for previous process to exit

const HotKeys = (await Native.require(require.resolve('./windows.native.js')));

Handlers.forEach(({ combos, repeat, match, which, open, code, when, }) => combos.forEach(mods => {
	HotKeys.register(mods.pop(), repeat === false ? mods.concat('MOD_NOREPEAT') : mods, async () => {
		let tabs = (await Tabs.query({ url: match, }));
		if (tabs.length) { switch (which) {
			case 'first': tabs = [ tabs[0], ]; break;
			case 'last': tabs = [ tabs.pop(), ]; break;
		} } else {
			if (!open) { return; }
			tabs = [ (await Tabs.create({ url: open, })), ];
		}
		(await Promise.all(tabs.map(tab => Tabs.executeScript(tab.id, { code, runAt: when, }))));
	});
}));

global.addEventListener('unload', () => Native.nuke());

// HotKeys.register('VK_KEY_B', [ 'MOD_ALT', ], () => reportSuccess('Keypress', 'ALT+B'));
// HotKeys.register('VK_KEY_C', [ 'MOD_ALT', ], () => reportSuccess('Keypress', 'ALT+C'));

// debug stuff
Object.assign(global, module.exports = {
	Browser: require('node_modules/web-ext-utils/browser/'),
	options,
	Native,
	HotKeys,
});

}); })(this);
