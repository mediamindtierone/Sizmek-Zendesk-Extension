var sz_rnd = Math.random() * 1000000;

var momentjs = document.createElement( 'script' );
momentjs.type = 'text/javascript';
momentjs.src = extensionRoot + "scripts/moment.min.js" + "?rnd=" + sz_rnd;
$("head").append( momentjs );

var szmod = document.createElement( 'script' );
szmod.type = 'text/javascript';
szmod.src = extensionRoot + "scripts/ZendeskExtension_plugin.js" + "?rnd=" + sz_rnd;
$("head").append( szmod );
