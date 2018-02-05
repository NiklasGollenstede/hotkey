(function(global) { 'use strict'; define(async ({ // This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
	'node_modules/web-ext-utils/browser/': { manifest, },
	'node_modules/web-ext-utils/browser/storage': { sync: storage, },
	'node_modules/web-ext-utils/options/': Options,
	'node_modules/regexpx/': { RegExpX, },
}) => {
const isBeta = (/^\d+\.\d+.\d+(?!$)/).test((global.browser || global.chrome).runtime.getManifest().version); // version doesn't end after the 3rd number ==> bata channel

/*
When any of the key combinations (...) is pressed
globally, choose (the first/last/closest tab / all tabs) matching (...) or open (.../none) and
execute (...) (once/repetitively as long as pressed).

When any of the key combinations (...) is pressed
in a tab matching (...)
execute (...) (once/repetitively as long as pressed).
*/

const model = {
	actions: {
		title: 'HotKey Actions',
		description: `Define any number of HotKeys and corresponding actions below:`,
		maxLength: Infinity,
		input: 'children',
		child: {
			title: {
				default: '', restrict: { type: 'string', },
				input: { type: 'string', placeholder: 'Display name', },
			},
			global: {
				description: `${manifest.name} can either listen for keypresses globally (system wide) or only in certain tabs:`,
				default: true, restrict: { type: 'boolean', },
				input: { type: 'menulist', prefix: `When any of the key combinations
				<b>Key Combos</b> is pressed`, options: [
					{ value: true,     label: `globally, choose *Match* tab(s) matching *Match* or open *Open* and`, },
					{ value: false,    label: `in a tab matching *Match*`, },
				], suffix: `execute <b>Action</b> (<b>Repeat</b>).`, },
			},
			combos: {
				title: `Key Combos`,
				description: ``,
				maxLength: Infinity,
				restrict: keyCombo(),
				input: { type: 'keybordKey', },
				default: [ ],
			},
			match: {
				title: `Tabs`,
				description: `Choose which tabs to listen or execute in (by URL).<br>
				Specify as <a href="https://developer.mozilla.org/Add-ons/WebExtensions/Match_patterns">Match Patterns</a>
				or <a href="https://regex101.com/">Regular Expressions</a> (advanced, must start with <code>^</code> and end with <code>$</code>).<br>
				See below for examples.`,
				maxLength: Infinity,
				default: [ ],
				restrict: { match: {
					exp: (/^(?:\^\S*\$|<all_urls>|(?:(\*|http|https|file|ftp|app):\/\/(\*|(?:\*\.)?[^\/\*\ ]+|)\/(\S*)))$/i),
					message: `Each pattern must be of the form <scheme>://<host>/<path> or be framed with '^' and '$'`,
				}, },
				input: { type: 'string', default: 'https://*.example.com/*', },
				children: {
					title: `Examples`,
					description: `<ul>
						<li><code>https://*.wikipedia.org/*</code>: Matches all Wikipedia pages</li>
						<li><code>https://www.whatever.web/sites.html</code>: Matches exactly that site</li>
						<li><code>&lt;all_urls&gt;</code>: Matches every URL</li>
						<li><code>^https?://(?:www\.)?google\.(?:com|co\.uk|de|fr|com\.au)/.*$</code>: Starting with <code>^</code> and ending with <code>$</code>, this is a Regular Expression.</li>
						<li><code>^.*$</code>: This is a Regular Expressions too. This one matches everything, so really only use it if you understand what you are doing!</li>
					</ul>`,
					expanded: false,
				},
			},
			which: {
				which: `Which`,
				default: 'closest', restrict: { type: 'string', match: (/^(all|first|last|closest)$/), },
				input: { type: 'menulist', prefix: `For global HotKeys, if there are multiple matching tabs open, use`, options: [
					{ value: 'all',    label: `them all`, },
					{ value: 'first',  label: `the first tab`, },
					{ value: 'last',   label: `the last tab`, },
					{ value: 'closet', label: `the one closest to the curren active tab`, },
				], suffix: `.`, },
			},
			open: {
				title: `Open`,
				default: '', restrict: { type: 'string', },
				input: { type: 'string', prefix: `For global HotKeys, if there is no matching tab open, open`, placeholder: '(none)', },
			},
			code: {
				title: `Action`,
				description: `JavaScript code to execute if the HotKey is triggered:`,
				default: '', restrict: { type: 'string', },
				input: { type: 'code', lang: 'js', },
			},
			repeat: {
				title: `Repeat`,
				default: false, restrict: { type: 'boolean', },
				input: { type: 'menulist', prefix: `On longer press, trigger`, options: [
					{ value: true,     label: `once`, },
					{ value: false,    label: 'repetitively', },
				], suffix: `.`, },
			},
		},
	},
	pollFrequency: {
		title: 'Check Frequency',
		description: `On Windows, ${manifest.name} has to repetitively query whether any of the global key combos has been pressed.
		By default, the background CPU usage is very low. Increasing the poll frequency can help if you feel that the key press actions respond slowly, but will increase the CPU usage.`,
		hidden: !global.navigator.userAgent.includes('(Windows '),
		default: 4,
		restrict: { type: 'number', from: .25, to: 60, },
		input: { type: 'integer', prefix: `Check`, suffix: `times per second.`, },
	},
	debug: {
		title: 'Debug Level',
		expanded: false,
		default: +isBeta,
		hidden: !isBeta,
		restrict: { type: 'number', from: 0, to: 2, },
		input: { type: 'integer', suffix: `set to > 0 to enable some diagnostic logging`, },
	},
};

return (await new Options({ model, storage, prefix: 'options', })).children;

function keyCombo() { return { match: (RegExpX`^ (?:Ctrl\+)? (?:Alt\+)? (?:Shift\+)? (?:
	  Key[A-Z]
	| F\d\d?
	| Digit\d
	| Numpad\d
	| Numpad(Subtract | Add | Decimal | Divide | Multiply | Enter | ChangeSign | Paren(Left | Right))
	| Minus | Equal
	| BracketLeft | BracketRight
	| Escape | Backspace | Enter | Tab | Space
	| Control(Left | Right)
	| Shift(Left | Right) | CapsLock | NumLock
	| Alt(Left | Right)
	| OS(Left | Right)
	| Quote | Backquote
	| Slash | Backslash | IntlBackslash
	| Semicolon | Comma | Period
	| Pause | ScrollLock | PrintScreen
	| Lang[12] | IntlYen
	| Undo | Paste | Cut | Copy
	| Media(PlayPause | Stop | Track(Previous | Next) | Select)
	| Volume(Down | Up | Mute)
	| Eject | BrowserHome | Help
	| Insert | Delete
	| Home | End
	| Page(Up | Down)
	| Arrow(Up | Down | Left | Right)
	| ContextMenu
	| Power
	| Browser(Search | Favorites | Refresh | Stop | Forward | Back)
	| Launch(App1 | App2 | Mail)
) $`), unique: '*', message: 'Please enter a valid key combination', }; }

}); })(this);
