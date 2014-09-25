var SZE_interval = setInterval(function() {
	var SZE;
	SZE = chrome.runtime;
	var sz_rnd = Math.random() * 1000000;
	if(typeof(SZE)!="undefined") {
		clearInterval(SZE_interval);
		
		var szemod = document.createElement("script");
		szemod.src = "https://secure-ds.serving-sys.com/burstingres/CustomScripts/ZendeskExtension_plugin.js?rnd=" + sz_rnd;
		
		var timeago = document.createElement("script");
		timeago.src = chrome.extension.getURL("scripts/moment.min.js")+"?rnd=" + sz_rnd;
		
		document.head.appendChild(szemod);
		document.head.appendChild(timeago);
	}
}, 1000); 