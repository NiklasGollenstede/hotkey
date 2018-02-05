/*eslint strict: ['error', 'global'], no-implicit-globals: 'off'*/ 'use strict'; /* globals module, */ // license: MPL-2.0
module.exports = function({ options, /*packageJson,*/ manifestJson, files, }) {

	manifestJson.permissions.push(
		'nativeMessaging',
		'notifications',
		'tabs',
		'<all_urls>',
	);

	!options.viewRoot && (options.viewRoot = options.chrome ? 'HotKey.html' : 'HotKey');
	delete manifestJson.browser_action;

	files.node_modules = [
		'native-ext/index.js',
//		'native-ext/install.js',
//		'native-ext/tar.js',
		'native-ext/version-native.js',
		'regexpx/index.js',
		'web-ext-utils/browser/index.js',
		'web-ext-utils/browser/storage.js',
		'web-ext-utils/browser/version.js',
		'web-ext-utils/lib/multiport/index.js',
		'web-ext-utils/lib/pbq/require.js',
		'web-ext-utils/loader/_background.html',
		'web-ext-utils/loader/_background.js',
		'web-ext-utils/loader/_view.html',
		'web-ext-utils/loader/_view.js',
//		'web-ext-utils/loader/content.js',
//		'web-ext-utils/loader/home.js',
//		'web-ext-utils/loader/index.js',
		'web-ext-utils/loader/views.js',
		'web-ext-utils/options/editor/about.css',
		'web-ext-utils/options/editor/about.js',
		'web-ext-utils/options/editor/index.css',
		'web-ext-utils/options/editor/index.js',
		'web-ext-utils/options/editor/inline.js',
		'web-ext-utils/options/editor/inline.css',
		'web-ext-utils/options/index.js',
//		'web-ext-utils/tabview/index.css',
//		'web-ext-utils/tabview/index.js',
//		'web-ext-utils/update/index.js',
		'web-ext-utils/utils/event.js',
		'web-ext-utils/utils/files.js',
		'web-ext-utils/utils/index.js',
		'web-ext-utils/utils/icons/error.svg',
		'web-ext-utils/utils/icons/success.svg',
//		'web-ext-utils/utils/semver.js',
	];

	if (options.run && !(options.run.prefs === 0 || options.run.prefs === null)) {
		const run = typeof options.run === 'object' ? options.run
		: (options.run = { bin: typeof options.run === 'string' ? options.run : undefined, });
		const prefs = {
			// ...
		};
		run.prefs ? Object.assign(run.prefs, prefs) : (run.prefs = prefs);
	}
};
