var sz_rnd = Math.random() * 1000000;

var szemod = document.createElement("script");
szemod.src = extensionRoot + "scripts/ZendeskExtension_plugin.js?rnd=" + sz_rnd;

var timeago = document.createElement("script");
timeago.src = extensionRoot + "scripts/moment.min.js" + "?rnd=" + sz_rnd;

var columnResize = document.createElement("script");
columnResize.src = extensionRoot + "scripts/colResizable-1.3.min.js" + "?rnd=" + sz_rnd;

document.head.appendChild(szemod);
document.head.appendChild(timeago);
document.head.appendChild(columnResize);