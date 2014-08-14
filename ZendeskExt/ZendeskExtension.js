(function()
{
	var SLAs;
	var RULEs = [
		{caption:"Case exceed in 60 mins", color:"#FFFF00", variable:"#XX", value:"60"},
		{caption:"Case exceed in 30 mins", color:"#FF9700", variable:"#XX", value:"30"},
		{caption:"Case exceed in 15 mins", color:"#FF6200",variable:"#XX", value:"15"},
		{caption:"Case Exceeded", color:"#CC0000", variable:"#XX", value:"0"},
	];
	
	function determineSLAs() 
	{
		SLAs = document.getElementsByClassName("21961139");
		for(var i=0 ; i<SLAs.length ; i++) 
		{
			if(SLAs[i].textContent != "" ) 
			{
				var toLocalDate = new Date(SLAs[i].textContent);
				var today = new Date();
				var timeRemaining = (toLocalDate-today)/60000;
				SLAs[i].parentElement.style.background = equateRule(timeRemaining, "SLA");
			}
		}
	}
	
	function equateRule(value, ruleType)
	{
		var result; //get the resulting color
		switch(ruleType) 
		{
			case "SLA":
				for(var i=0 ; i<RULEs.length ; i++)
				{
					if(value<=RULEs[i].value)
						result = RULEs[i].color;
				}
				break;
			default:
				break;
		}
		
		return result;
	}
	
	function placeLegendOnPage() 
	{
		var ntvl = setInterval( function()
		{
			var prevIconElem = document.getElementsByClassName("icons")[0];
			if(typeof(prevIconElem)!="undefined" && prevIconElem != null)
			{
				console.log("found it");
				clearInterval(ntvl);
				var legendIconHandler = document.createElement("div");
				var legendHandler = createLegend();
				legendIconHandler.style.textAlign = "center";
				var icon = new Image();
				icon.style.height = "35px";
				icon.style.width = "35px";
				icon.style.opacity = "0.5";
				icon.onmouseover = function() 
				{
					icon.style.opacity = "0.8";
					legendHandler.style.top = legendIconHandler.offsetTop + "px";
					legendHandler.style.display = "block";
				};
				icon.onmouseout = function() 
				{
					icon.style.opacity = "0.5";
					legendHandler.style.top = legendIconHandler.offsetTop + "px";
					legendHandler.style.display = "none";
				};
				icon.src = chrome.extension.getURL('images/Lancer_icon.png');
				legendIconHandler.style.color = "black";
				legendIconHandler.appendChild(icon);
				legendIconHandler.appendChild(legendHandler);
				prevIconElem.insertAdjacentElement("BeforeBegin",legendIconHandler);
			} 
		}, 1000);
	}
	
	function createLegend()
	{
		var legendHandler = document.createElement("div");
		legendHandler.style.display = "none";
		legendHandler.style.position = "absolute";
		legendHandler.style.left = "60px";
		legendHandler.style.border = "1px solid #ccc";
		legendHandler.style.borderLeft = "0px";
		legendHandler.style.width = "250px";
		legendHandler.style.padding = "15px";
		legendHandler.style.background = "#e7e7e7";
		var legendCaption = document.createElement("div");
		legendCaption.innerHTML = "Legend";
		legendCaption.style.textAlign = "center";
		legendHandler.appendChild(legendCaption);
		for(var i=0 ; i<RULEs.length ; i++)
		{
			var ruleHandler = document.createElement("div");
			ruleHandler.textContent = RULEs[i].caption;
			ruleHandler.style.background = RULEs[i].color;
			ruleHandler.style.border = "1px solid #ccc";
			ruleHandler.style.margin = "5px";
			legendHandler.appendChild(ruleHandler);
		}
		
		return legendHandler;
	}
	
	try 
	{
		var extensionInterval = setInterval(function(){determineSLAs()}, 1000);
		placeLegendOnPage();
	} 
	catch(e) {console.log("error: " + e);}
}
)()