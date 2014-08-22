var SZE_interval = setInterval(function() {
	var SZE;
	SZE = chrome.runtime;
	if(typeof(SZE)!="undefined") {
		clearInterval(SZE_interval);
		var szemod = document.createElement("script");
			szemod.src="https://secure-ds.serving-sys.com/burstingres/CustomScripts/ZendeskExtension_plugin.js?rnd="+(Math.random()*1000000);
			document.head.appendChild(szemod);
	}
}, 1000); 