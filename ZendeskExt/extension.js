var sz_rnd = Math.random() * 1000000;
var momentjs, szmod;

if(typeof(extensionRoot)!="undefined") {
	momentjs = document.createElement( 'script' );
	momentjs.type = 'text/javascript';
	momentjs.src = extensionRoot + "scripts/moment.min.js" + "?rnd=" + sz_rnd;
	jQuery("head").append( momentjs );

	szmod = document.createElement( 'script' );
	szmod.type = 'text/javascript';
	szmod.src = extensionRoot + "scripts/ZendeskExtension_plugin.js" + "?rnd=" + sz_rnd;
	jQuery("head").append( szmod );
} else {
	momentjs = document.createElement( 'script' );
	momentjs.type = 'text/javascript';
	momentjs.src = chrome.extension.getURL("scripts/moment.min.js")+"?rnd=" + sz_rnd;

	szmod = document.createElement( 'script' );
	szmod.type = 'text/javascript';
	szmod.src = chrome.extension.getURL("scripts/ZendeskExtension_plugin.js")+"?rnd=" + sz_rnd;

	document.head.appendChild(szmod);
	document.head.appendChild(momentjs);
}