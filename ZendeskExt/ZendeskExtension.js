//(function()
//{
	var SLAs;
	var RULEs = [
		{caption:"Case exceed in 60 mins", color:"#FFFF00", variable:"#XX", value:"60", editMode:1},
		{caption:"Case exceed in 30 mins", color:"#FF9700", variable:"#XX", value:"30", editMode:0},
		{caption:"Case exceed in 15 mins", color:"#FF6200",variable:"#XX", value:"15", editMode:0},
		{caption:"Case Exceeded", color:"#CC0000", variable:"#XX", value:"0", editMode:0},
	];
	var origRULEs;
	
	function init()
	{
		Array.prototype.contains = function(v) {
			for(var i = 0; i < this.length; i++) { if(this[i] === v) return true; }
			return false;
		};
		Array.prototype.unique = function() {
			var arr = [];
			for(var i = 0; i < this.length; i++) { if(!arr.contains(this[i])) arr.push(this[i]); }
			return arr; 
		}
	}
	
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
				SLAs[i].textContent = toLocalDate.toLocaleString();//translate the date (based on GMT) to local date
				SLAs[i].parentElement.style.background = equateRule(timeRemaining, "SLA");
			}
		}
	}
	
	function equateRule(value, ruleType)
	{
		var result; //get the result
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
	
	function resetData() 
	{
		localStorage.setItem("SizmekZendeskExtension", JSON.stringify(origRULEs));
		RULEs = JSON.parse(initData);
	}
	
	function placeIconsOnPage() 
	{
		var ntvl = setInterval( function()
		{
			var prevIconElem = document.getElementsByClassName("icons")[0];
			if(typeof(prevIconElem)!="undefined" && prevIconElem != null)
			{
				clearInterval(ntvl);
				var legendIconHandler = document.createElement("div");
				legendHandler = document.createElement("div");
				legendHandler.appendChild(createLegend());
				legendHandler.setAttribute("id", "legendHandler");
				legendHandler.style.display = "none";
				legendHandler.style.height = "38px";
				legendIconHandler.style.textAlign = "center";
				
				var legendIcon = new Image();
				legendIcon.style.height = "35px";
				legendIcon.style.width = "35px";
				legendIcon.style.opacity = "0.4";
				legendIcon.src = chrome.extension.getURL('images/Lancer_icon.png');
				legendIcon.title = "Click ME to reset the Data";
				legendIcon.onmouseover = function() 
				{
					legendIcon.style.opacity = "0.8";
					legendHandler.style.marginTop = "-38px";
					legendHandler.style.display = "block";
				};
				legendIcon.onmouseout = function() 
				{
					legendIcon.style.opacity = "0.4";
					legendHandler.style.marginTop = "-38px";
					legendHandler.style.display = "none";
				};
				legendIcon.onclick = function()
				{
					var r=confirm("Reset Data?");
					if(r) {
						resetData();
						document.getElementById("legendData").remove();
						document.getElementById("legendHandler").appendChild(createLegend());
						
						document.getElementById("settingsData").remove();
						document.getElementById("settingsHandler").appendChild(createSettings());
					} else {
						console.log("--delete action abandoned--");
					}
				}

				legendIconHandler.style.color = "black";
				legendIconHandler.appendChild(legendIcon);
				legendIconHandler.appendChild(legendHandler);
				
				var settingsIconHandler = document.createElement("div");
				settingsIconHandler.style.textAlign = "center";
				var settingsIcon = new Image();
				settingsIcon.style.height = "30px";
				settingsIcon.style.width = "30px";
				settingsIcon.style.opacity = "0.4";
				settingsIcon.src = chrome.extension.getURL('images/Vault_logo.png');
				var settingsHandler = document.createElement("div");
				settingsHandler.appendChild(createSettings());
				settingsHandler.style.display = "none";
				settingsHandler.setAttribute("id", "settingsHandler");
				settingsIcon.onclick = function() 
				{
					settingsHandler.style.display = "block";
					document.getElementById("settingsData").style.display = "block";
				}
				settingsIcon.onmouseover = function() {settingsIcon.style.opacity = "0.8";};
				settingsIcon.onmouseout = function() {settingsIcon.style.opacity = "0.4";};
				settingsIconHandler.appendChild(settingsIcon);
				document.body.appendChild(settingsHandler);
				
				var statsIconHandler = document.createElement("div");
				statsIconHandler.style.textAlign = "center";
				var statsHandler = document.createElement("div");
				statsHandler.style.display = "none";
				statsHandler.appendChild(createStats());
				statsHandler.setAttribute("id", "statsHandler");
				var statsIcon = new Image();
				statsIcon.style.height = "35px";
				statsIcon.style.width = "35px";
				statsIcon.style.opacity = "0.4";
				statsIcon.src = chrome.extension.getURL('images/Titan_icon.png');
				statsIcon.onclick = function()
				{
					document.getElementById("statsData").remove();
					document.getElementById("statsHandler").appendChild(createStats());
					statsHandler.style.display = "block";
				}
				statsIcon.onmouseover = function() {statsIcon.style.opacity = "0.8";};
				statsIcon.onmouseout = function() {statsIcon.style.opacity = "0.4";};
				statsIconHandler.appendChild(statsHandler);
				statsIconHandler.appendChild(statsIcon);
				
				prevIconElem.insertAdjacentElement("BeforeBegin",legendIconHandler);
				prevIconElem.insertAdjacentElement("BeforeBegin",settingsIconHandler);
				prevIconElem.insertAdjacentElement("BeforeBegin",statsIconHandler);
			} 
		}, 1000);
	}
	
	function retrieveStats()
	{
		var message = "";
		var results = [];
		var tempResults = [];
		var cnt=0;
		var assignee = document.getElementsByClassName("assignee");
		if(typeof(assignee)!="undefined"&&assignee.length>-1)
		{
			for(var i=0 ; i<assignee.length ; i++)
			{
				if(assignee[i].textContent!="-")
					tempResults.push(assignee[i].textContent);
			}
		}
		
		results = tempResults.unique();
		for(var i=0 ; i<results.length ; i++)
		{
			cnt=0;
			for(var j=0 ; j<tempResults.length ; j++)
			{
				if(results[i]==tempResults[j])
					cnt++;
			}
			message += results[i] + "  " + cnt + "<br>";
		}
		
		return message;
	}
	
	//_Create Form Functions
	function createLegend()
	{
		var legendHandler = document.createElement("div");
		legendHandler.setAttribute("id", "legendData");
		//legendHandler.style.display = "none";
		legendHandler.style.position = "absolute";
		legendHandler.style.left = "60px";
		legendHandler.style.border = "1px solid #ccc";
		legendHandler.style.borderLeft = "0px";
		legendHandler.style.width = "250px";
		legendHandler.style.padding = "15px";
		legendHandler.style.background = "#e7e7e7";
		legendHandler.style.borderTopRightRadius = "4px";
		legendHandler.style.borderBottomRightRadius = "4px";
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
	
	function createStats()
	{
		var statsContainer = document.createElement("div");
		statsContainer.setAttribute("id","statsData");
		var backDrop = document.createElement("div");
		backDrop.setAttribute("class", "modal-backdrop  in");
		var stats = document.createElement("div");
		stats.setAttribute("class","modal");
		stats.style.width = "500px";
		var statsHeader = document.createElement("div");
		statsHeader.setAttribute("class", "modal-header");
		var statsClose = document.createElement("a");
		statsClose.setAttribute("class", "close");
		statsClose.setAttribute("data-dismiss", "modal");
		statsClose.textContent = "×";
		statsClose.onclick = function()
		{
			statsContainer.style.display = "none";
		}
		var statsData = document.createElement("div");
		statsData.style.textAlign = "left";
		statsData.style.paddingLeft = "10px";
		statsData.innerHTML = retrieveStats();
		var settingsHeaderCaption = document.createElement("h3");
		settingsHeaderCaption.textContent = "Case Status";
		var statsFooter = document.createElement("div");
		statsFooter.setAttribute("class", "modal-footer");
		statsFooter.style.marginTop = "219px";
		statsFooter.style.width = "468px";
		
		statsHeader.appendChild(statsClose);
		statsHeader.appendChild(settingsHeaderCaption);
		stats.appendChild(statsHeader);
		stats.appendChild(statsData);
		stats.appendChild(statsFooter);
		statsContainer.appendChild(backDrop);
		statsContainer.appendChild(stats);
		
		return statsContainer;
	}
	
	function createSettings() 
	{
		var container = document.createElement("div");
		container.setAttribute("id", "settingsData");
		container.style.display = "none";
		container.style.zIndex = "999999";
		container.style.position = "absolute";
		var backDrop = document.createElement("div");
		backDrop.setAttribute("class", "modal-backdrop  in");
		var settings = document.createElement("div");
		settings.setAttribute("class","modal");
		settings.style.width = "500px";
		settings.style.height = "500px";
		var settingsHeader = document.createElement("div");
		settingsHeader.setAttribute("class", "modal-header");
		var settingsClose = document.createElement("a");
		settingsClose.setAttribute("class", "close");
		settingsClose.setAttribute("data-dismiss", "modal");
		settingsClose.textContent = "×";
		settingsClose.onclick = function()
		{
			container.style.display = "none";
		}
		var settingsHeaderCaption = document.createElement("h3");
		settingsHeaderCaption.textContent = "Sizmek Zendesk Extension";
		var settingsFooter = document.createElement("div");
		settingsFooter.setAttribute("class", "modal-footer");
		settingsFooter.style.marginTop = "219px";
		settingsFooter.style.width = "468px";
		var settingsSave = document.createElement("a");
		settingsSave.textContent = "Save";
		settingsSave.setAttribute("class","btn btn-inverse");
		settingsSave.onclick = function()	
		{
			localStorage.setItem("SizmekZendeskExtension", JSON.stringify(RULEs));
			container.style.display = "none";
			
			document.getElementById("legendData").remove();
			document.getElementById("legendHandler").appendChild(createLegend());
		}
		settingsFooter.appendChild(settingsSave);
		
		var rulesContainer = document.createElement("div");
		rulesContainer.style.marginTop = "15px";
		var rulesTable = document.createElement("table");
		rulesTable.style.margin = "0px auto";
		for(var i=0 ; i<RULEs.length ; i++)
		{
			var row = document.createElement("tr");
			row.style.border = "1px solid #ccc";
			var colCaption = document.createElement("td");
			colCaption.textContent = RULEs[i].caption;
			colCaption.style.padding = "5px";
			
			var colValue = document.createElement("td");
			var inputValue;
			if(RULEs[i].editMode==1)
			{
				inputValue = document.createElement("input");
				inputValue.type = "text";
				inputValue.setAttribute("data-flag", i);
				inputValue.value = RULEs[i].value;
				inputValue.onchange = function() { RULEs[this.getAttribute("data-flag")].value = this.value; }
			}
			else
			{
				inputValue = document.createElement("label");
				inputValue.textContent = RULEs[i].value;
			}
			colValue.style.padding = "5px";
			colValue.appendChild(inputValue);
			
			var colColor = document.createElement("td");
			var inputColor = document.createElement("input");
			inputColor.type = "color";
			inputColor.value = RULEs[i].color;
			inputColor.setAttribute("data-flag", i);
			inputColor.style.width = "100px"
			inputColor.style.display = "table-cell";
			inputColor.style.border = "1px solid #ccc";
			inputColor.onchange = function()
			{
				RULEs[this.getAttribute("data-flag")].color = this.value;
			}
			colColor.style.padding = "5px";
			colColor.appendChild(inputColor);
			
			row.appendChild(colCaption);
			row.appendChild(colValue);
			row.appendChild(colColor);
			rulesTable.appendChild(row);
		}
		rulesContainer.appendChild(rulesTable);
		
		settingsHeader.appendChild(settingsClose);
		settingsHeader.appendChild(settingsHeaderCaption);
		settings.appendChild(settingsHeader);
		settings.appendChild(rulesContainer);
		settings.appendChild(settingsFooter);
		container.appendChild(settings);
		container.appendChild(backDrop);
		
		return container;
	}
	
	//start me up
	try 
	{
		init();
		var extensionInterval = setInterval(function(){determineSLAs()}, 1000);
		var initData = localStorage.getItem("SizmekZendeskExtension");
		origRULEs = RULEs;
		if(typeof(initData)!="undefined"&&initData!=null) RULEs = JSON.parse(initData);
		placeIconsOnPage();
	} 
	catch(e) {console.log("error: " + e);}
//}
//)()