(function(global) { 'use strict'; define(async ({ // This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
	'node_modules/web-ext-utils/browser/': { Tabs, },
	'node_modules/web-ext-utils/browser/storage': Storage,
	'node_modules/web-ext-utils/utils/notify': notify,
	'node_modules/native-ext/': Native,
	'common/options': options,
	Handlers,
	module, require,
}) => {

(await new Promise(done => global.setTimeout(done, 2000))); // wait for previous process to exit

Native.on(async process => {
	console.info('process launched', process);

	const HotKeys = global.HotKeys = (await process.require(require.resolve('./windows/native.js')));

	Handlers.forEach(async ({ combos, repeat, match, which, open, code, }) => {
		async function onkeypress(combo) { try {
			console.info('keypress', combo);
			let tabs = (await Tabs.query({ url: match, }));
			if (tabs.length) { switch (which) {
				case 'first': tabs = [ tabs[0], ]; break;
				case 'last': tabs = [ tabs.pop(), ]; break;
			} } else {
				if (!open) { notify.log('Nothing to do', 'for '+ combo); return; }
				tabs = [ (await Tabs.create({ url: open, })), ];
			}
			(await Promise.all(tabs.map(tab => Tabs.executeScript(tab.id, { code, runAt: 'document_start', }))));
		} catch(error) {
			notify.error('Failed run HotKey action', combo, error);
		} }

		const unbind = (await Promise.all(combos.map(combo => HotKeys.register(combo, repeat, onkeypress).catch(
			error => void notify.error('Failed to register HotKey', combo, error)
		)))); console.log('registered', combos);
		void unbind; // array of functions
	});

	HotKeys.register('Alt + KeyB', false, combo => notify.info('Keypress', combo));
	HotKeys.register('Alt + KeyC', false, combo => notify.warn('Keypress', combo));
});


// debug stuff
Object.assign(global, module.exports = {
	Browser: require('node_modules/web-ext-utils/browser/'), Storage,
	options,
	Native,
});

}); })(this);
