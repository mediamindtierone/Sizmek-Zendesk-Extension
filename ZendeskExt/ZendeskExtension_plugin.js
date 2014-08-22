//(function()
//{
	var SLAs;
	
	var SZE =
	{
		RULEs: [
			{caption:"Ticket exceed in 60 mins", color:"#FFEB44", variable:"#XX", value:"60", editMode:1},
			{caption:"Ticket exceed in 30 mins", color:"#E8B73F", variable:"#XX", value:"30", editMode:0},
			{caption:"Ticket exceed in 15 mins", color:"#FF8B5E",variable:"#XX", value:"15", editMode:0},
			{caption:"Ticket Exceeded", color:"#ff5351", variable:"#XX", value:"0", editMode:0},
		],
		SETTINGs: {
			refreshRate:60000
		}
	};
	var origSETTINGs;
	var autoRefreshInterval;
	var refreshBtn;
	
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
	
	function formatDate(sla, today)
	{
		var result;
		var dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
		var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

		if(sla.getDate()==today.getDate())
			return "Today " + today.getHours() + ":" + today.getMinutes();
		else if((sla.getDate()-today.getDate())==1)
			return "Tomorrow " + sla.getHours() + ":" + sla.getMinutes();
		else if((today.getDate()-sla.getDate())>1)
			return monthNames[sla.getMonth()] + " " + sla.getDate();
		else if((sla.getDate()-today.getDate())==-1)
			return "Yesterday " + sla.getHours() + ":" + sla.getMinutes();
		else if(sla.getWeek()==today.getWeek())
			return dayNames[sla.getDay()] + " " + sla.getHours() + ":" + sla.getMinutes();
		else if((today.getWeek()-sla.getWeek())>0)
			return monthNames[sla.getMonth()] + " " + sla.getDate();
	}
	
	function autoRefresh()
	{
		var actionButtons = document.getElementsByClassName("action_button");
		for(var i=0 ; i<actionButtons.length ; i++)
		{
			if(actionButtons[i].getAttribute("data-ember-action")==21)
			{
				refreshBtn = actionButtons[i];
			}
		}
		
		if(SZE.SETTINGs.refreshRate!=null&&typeof(SZE.SETTINGs.refreshRate)!="undefined"&&SZE.SETTINGs.refreshRate>0&&typeof(refreshBtn)!="undefined")
		{
			autoRefreshInterval = setInterval(function()
			{
				console.log("refreshing list");
				refreshBtn.click();
			},SZE.SETTINGs.refreshRate);
		}
		else
		{
			setTimeout(function()
			{
				checkData();
				autoRefresh();
			},2000);
		}
	}
	
	function setDateTimeValue()
	{
		SLAs = document.getElementsByClassName("21961139");
		for(var i=0 ; i<SLAs.length ; i++) 
		{
			if(SLAs[i].textContent != "" ) 
			{
				SLAs[i].setAttribute("datetime", SLAs[i].textContent);
			}
		}
	}
	function determineSLAs() 
	{
		SLAs = document.getElementsByClassName("21961139");
		for(var i=0 ; i<SLAs.length ; i++) 
		{
			if(SLAs[i].textContent != "" && SLAs[i].getAttribute("datetime") != null) 
			{
				var toLocalDate = new Date(SLAs[i].getAttribute("datetime"));
				var today = new Date();
				var timeRemaining = (toLocalDate-today)/60000;
				SLAs[i].textContent = formatDate(toLocalDate, today);//translate the date (based on GMT) to local date
				SLAs[i].parentElement.style.background = equateRule(timeRemaining, "SLA");
			} 
			else 
			{
				setDateTimeValue();
			}
		}
	}
	
	function equateRule(value, ruleType)
	{
		var result; //get the result
		switch(ruleType) 
		{
			case "SLA":
				for(var i=0 ; i<SZE.RULEs.length ; i++)
				{
					if(value<=SZE.RULEs[i].value)
						result = SZE.RULEs[i].color;
				}
				break;
			default:
				break;
		}
		
		return result;
	}
	
	function resetData() 
	{
		localStorage.setItem("SizmekZendeskExtension", JSON.stringify(origSETTINGs));
		var initData = localStorage.getItem("SizmekZendeskExtension");
		SZE = JSON.parse(initData);
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
				legendIconHandler.style.textAlign = "center";
				legendIconHandler.style.paddingTop = "15px";
				legendHandler = document.createElement("div");
				legendHandler.appendChild(createLegend());
				legendHandler.setAttribute("id", "legendHandler");
				legendHandler.style.display = "none";
				legendHandler.style.height = "38px";
				
				var legendIcon = new Image();
				legendIcon.style.height = "24px";
				legendIcon.style.width = "24px";
				legendIcon.style.opacity = "0.4";
				legendIcon.src = "https://secure-ds.serving-sys.com/BurstingRes/Site-2/Type-0/782bd141-d3e1-4e40-98f4-60e7a7b50f9b.png";
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
				settingsIconHandler.style.paddingTop = "15px";
				var settingsIcon = new Image();
				settingsIcon.style.height = "24px";
				settingsIcon.style.width = "24px";
				settingsIcon.style.opacity = "0.4";
				settingsIcon.src = "https://secure-ds.serving-sys.com/BurstingRes/Site-2/Type-0/b184dc4c-bb22-4477-a4e1-7c2038db24c4.png";
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
				statsIconHandler.style.paddingTop = "15px";
				var statsHandler = document.createElement("div");
				statsHandler.style.display = "none";
				statsHandler.appendChild(createStats());
				statsHandler.setAttribute("id", "statsHandler");
				var statsIcon = new Image();
				statsIcon.style.height = "24px";
				statsIcon.style.width = "24px";
				statsIcon.style.opacity = "0.4";
				statsIcon.src = "https://secure-ds.serving-sys.com/BurstingRes/Site-2/Type-0/fc81b0ef-eb55-4ce4-bb64-8d80b8f79f12.png";
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
		for(var i=0 ; i<SZE.RULEs.length ; i++)
		{
			var ruleHandler = document.createElement("div");
			ruleHandler.textContent = SZE.RULEs[i].caption;
			ruleHandler.style.background = SZE.RULEs[i].color;
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
			localStorage.setItem("SizmekZendeskExtension", JSON.stringify(SZE));
			container.style.display = "none";
			
			document.getElementById("legendData").remove();
			document.getElementById("legendHandler").appendChild(createLegend());
		}
		settingsFooter.appendChild(settingsSave);
		
		var rulesContainer = document.createElement("div");
		rulesContainer.style.marginTop = "15px";
		var rulesTable = document.createElement("table");
		rulesTable.style.margin = "0px auto";
		for(var i=0 ; i<SZE.RULEs.length ; i++)
		{
			var row = document.createElement("tr");
			row.style.border = "1px solid #ccc";
			var colCaption = document.createElement("td");
			colCaption.textContent = SZE.RULEs[i].caption;
			colCaption.style.padding = "5px";
			
			var colValue = document.createElement("td");
			var inputValue;
			if(SZE.RULEs[i].editMode==1)
			{
				inputValue = document.createElement("input");
				inputValue.type = "text";
				inputValue.setAttribute("data-flag", i);
				inputValue.value = SZE.RULEs[i].value;
				inputValue.onchange = function() { SZE.RULEs[this.getAttribute("data-flag")].value = this.value; }
			}
			else
			{
				inputValue = document.createElement("label");
				inputValue.textContent = SZE.RULEs[i].value;
			}
			colValue.style.padding = "5px";
			colValue.appendChild(inputValue);
			
			var colColor = document.createElement("td");
			var inputColor = document.createElement("input");
			inputColor.type = "color";
			inputColor.value = SZE.RULEs[i].color;
			inputColor.setAttribute("data-flag", i);
			inputColor.style.width = "100px"
			inputColor.style.display = "table-cell";
			inputColor.style.border = "1px solid #ccc";
			inputColor.onchange = function()
			{
				SZE.RULEs[this.getAttribute("data-flag")].color = this.value;
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
	
	function checkData()
	{
		var initData = localStorage.getItem("SizmekZendeskExtension");
		if(typeof(initData)!="undefined"&&initData!=null) SZE = JSON.parse(initData);
		else
		{
			localStorage.setItem("SizmekZendeskExtension", JSON.stringify(SZE));
			initData = localStorage.getItem("SizmekZendeskExtension");
			SZE = JSON.parse(initData);
		}
		origSETTINGs = SZE;
	}
	
	//start me up
	try 
	{
		init();
		setDateTimeValue();
		var extensionInterval = setInterval(function(){determineSLAs()}, 1000);
		checkData();
		placeIconsOnPage();
		setTimeout(autoRefresh(), 2000);
	} 
	catch(e) {console.log("error: " + e);}
//}
//)()