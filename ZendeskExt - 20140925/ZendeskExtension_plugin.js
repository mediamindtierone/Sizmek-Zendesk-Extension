var SZE =
{
	RULEs: [
		{caption:"Ticket exceed in 60 mins", color:"#FFEB44", variable:"#XX", value:"60", editMode:1},
		{caption:"Ticket exceed in 30 mins", color:"#E8B73F", variable:"#XX", value:"30", editMode:0},
		{caption:"Ticket exceed in 15 mins", color:"#FF8B5E",variable:"#XX", value:"15", editMode:0},
		{caption:"Ticket Exceeded", color:"#ff5351", variable:"#XX", value:"0", editMode:0},
	],
	SETTINGs: {
		refreshRate:60000, version: "1.6"
	}
};
var origSETTINGs, autoRefreshInterval, extensionInterval, refreshBtn, SLAs;

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

function autoRefresh()
{
	var icon_refresh = document.getElementsByClassName("icon-refresh")[0];
	refreshBtn = icon_refresh.parentElement;
	if(typeof(refreshBtn)!="undefined"&&refreshBtn!=null)
	{
		if(SZE.SETTINGs.refreshRate!=null&&typeof(SZE.SETTINGs.refreshRate)!="undefined"&&SZE.SETTINGs.refreshRate>0&&typeof(refreshBtn)!="undefined")
		{
			autoRefreshInterval = setInterval(function(){refreshBtn.click();},SZE.SETTINGs.refreshRate);
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
	else
	{
		autoRefresh();
		console.log("resfresh button not found on the page. something might have changed.. again. Please contact Wind.");
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
			SLAs[i].style.minWidth = "157px";
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
			SLAs[i].textContent = moment(toLocalDate).fromNow();
			SLAs[i].parentElement.style.background = equateRule(timeRemaining, "SLA");
		} 
		else {setDateTimeValue();}
	}
}

function equateRule(value, ruleType)
{
	var result;
	switch(ruleType) 
	{
		case "SLA":
			for(var i=0 ; i<SZE.RULEs.length ; i++)
			{
				if(value<=SZE.RULEs[i].value)
					result = SZE.RULEs[i].color;
			}
			return result;
		default:
			break;
	}
}

function resetData() 
{
	clearInterval(autoRefreshInterval);
	localStorage.setItem("SizmekZendeskExtension", JSON.stringify(origSETTINGs));
	var initData = localStorage.getItem("SizmekZendeskExtension");
	SZE = JSON.parse(initData);
	setTimeout(autoRefresh(), 2000);
}

function placeIconsOnPage() 
{
	var ntvl = setInterval( function()
	{
		var prevIconElem = document.getElementsByClassName("icons")[0];
		if(typeof(prevIconElem)!="undefined" && prevIconElem != null)
		{
			clearInterval(ntvl);
			$(".icons").before($('<div style="text-align:center;padding-top:15px;color:black;" id="legendIconHandler"><img src="https://secure-ds.serving-sys.com/BurstingRes/Site-2/Type-0/782bd141-d3e1-4e40-98f4-60e7a7b50f9b.png" title="Click ME to reset the Data" style="height: 24px; width: 24px; opacity: 0.4;" id="legendIcon"></div>'));
			createLegend();
			$("#legendIcon").hover(
			function(){
				$(this).css("opacity","0.8");
				$("#legendData").show();
			},function(){
				$(this).css("opacity","0.4");
				$("#legendData").hide();
			});
			$("#legendIcon").click(
				function()
				{
					var r=confirm("Reset Data?");
					if(r) {
						resetData();
						$("#legendData").remove();
						createLegend();
					} else {console.log("--delete action abandoned--");	}
				}
			);
			
			$(".icons").before($('<div style="text-align: center; padding-top: 15px;" id="settingsIconHandler"><img title="Settings" src="https://secure-ds.serving-sys.com/BurstingRes/Site-2/Type-0/b184dc4c-bb22-4477-a4e1-7c2038db24c4.png" style="height: 24px; width: 24px; opacity: 0.4;" id="settingsIcon"></div>'));
			$("#settingsIcon").hover(
				function(){	$(this).css("opacity","0.8");},
				function(){	$(this).css("opacity","0.4");}
			);
			$("#settingsIcon").click(
				function()
				{
					createSettings();
					$("#settingsData").show();
				}
			);
			
			$(".icons").before('<div style="text-align: center; padding-top: 15px;" id="statsIconHandler"><img title="Case Status" src="https://secure-ds.serving-sys.com/BurstingRes/Site-2/Type-0/fc81b0ef-eb55-4ce4-bb64-8d80b8f79f12.png" style="height: 24px; width: 24px; opacity: 0.4;" id="statsIcon"></div>');
			$("#statsIcon").hover(
				function(){	$(this).css("opacity","0.8");},
				function(){	$(this).css("opacity","0.4");}
			);
			$("#statsIcon").click(function(){createStats();});
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
			if(assignee[i].textContent!="-"){tempResults.push(assignee[i].textContent);}
		}
	}
	message += "<table><tr><th>Assignee</th><th> # of assigned cases</th></tr>";
	results = tempResults.unique();
	for(var i=0 ; i<results.length ; i++)
	{
		cnt=0;
		for(var j=0 ; j<tempResults.length ; j++)
		{
			if(results[i]==tempResults[j]){cnt++;}
		}
		message += "<tr><td>" + results[i] + "</td>  <td style='text-align:center;'><b>" + cnt + "</b></td></tr>";
	}
	message += "</table>";
	
	return message;
}

//_Create Form Functions
function createLegend()
{
	$("#legendIconHandler").append('<div style="position:absolute;left:60px;border:1px solid #ccc;border-left:0px;width:250px;padding:15px;background:#e7e7e7;border-top-right-radius:4px;border-bottom-right-radius:4px;margin-top:-38px;display:none;" id="legendData"></div>');
	$("#legendData").append('<span style="text-align:center;">Legend</span>');
	for(var i=0 ; i<SZE.RULEs.length ; i++)
	{
		$("#legendData").append('<div style="background:' + SZE.RULEs[i].color + ';border:1px solid #ccc;margin:5px;">' + SZE.RULEs[i].caption + '</div>');
	}
}

function createStats()
{
	$("body").append('<div id="statsData"><div class="modal" style="width: 500px;"><div class="modal-header"><a class="close" data-dismiss="modal">×</a><h3>Case Status</h3></div><div style="text-align: left; padding-left: 10px;" id="statsHolder"></div><div class="modal-footer" style="margin-top: 219px; width: 468px;"></div></div><div class="modal-backdrop  in"></div></div>');
	$("#statsData").click(
		function(){$(this).remove();}
	);
	$("#statsHolder").append(retrieveStats());
}

function createSettings() 
{
	$("body").append('<div id="settingsData" style="z-index: 999999; position: absolute;"><div id="settingsContainer" class="modal" style="width: 510px; height: 516px;"><div class="modal-header"><a class="close" data-dismiss="modal" id="settingsClose">×</a><h3>Sizmek Zendesk Extension</h3></div><div id="rulesContainer" style="margin-top:15px;"></div><div id="settingsFooter" class="modal-footer" style="margin-top: 235px; width: 478px;"><div style="float: left;"><span>Refresh Rate (seconds): </span><input id="refreshValue" type="text"/></div><a class="btn btn-inverse" id="settingsSave">Save</a></div></div><div class="modal-backdrop  in"></div></div>');
	$("#settingsData").hide();
	$("#settingsClose").click(
		function(){$("#settingsData").remove();}
	);
	$("#settingsSave").click(
		function()
		{
			localStorage.setItem("SizmekZendeskExtension", JSON.stringify(SZE));
			$("#settingsData").remove();
			
			clearInterval(autoRefreshInterval);
			setTimeout(autoRefresh(), 2000);
			
			$("#legendData").remove();
			createLegend();
		}
	);
	$("#refreshValue").val(parseInt(SZE.SETTINGs.refreshRate)/1000);
	$("#refreshValue").change(
		function(){	SZE.SETTINGs.refreshRate = parseInt($(this).val())*1000;}
	);
	
	var rulesTable = $('<table style="margin:0px auto;"></table>');
	for(var i=0 ; i<SZE.RULEs.length ; i++)
	{
		var row =$('<tr style="border:1px solid #ccc"></tr>');
		var colCaption = $('<td style="padding:5px;">' + SZE.RULEs[i].caption + '</td>');
		
		var colValue = $('<td style="padding:5px;"></td>');
		var inputValue;
		if(SZE.RULEs[i].editMode==1)
		{
			inputValue = $('<input type="text" data-flag="' + SZE.RULEs[i].value + '">')
			inputValue.val(SZE.RULEs[i].value);
			inputValue.change(
				function() { SZE.RULEs[$(this).attr("data-flag")].value = $(this).val(); }
			);
		}
		else{inputValue = $('<label>' + SZE.RULEs[i].value + '</label>');}
		colValue.append(inputValue);
		
		var colColor = $('<td style="padding:5px;"></td>');
		var inputColor = $('<input type="color" data-flag="' + i + '" value="' + SZE.RULEs[i].color + '"style="width:100px;display:table-cell;border:1px solid #ccc">')
		inputColor.change(
			function(){	SZE.RULEs[$(this).attr("data-flag")].color = $(this).val();	}
		);
		colColor.append(inputColor);
		row.append(colCaption);
		row.append(colValue);
		row.append(colColor);
		rulesTable.append(row);
	}
	$("#rulesContainer").append( rulesTable );
}

function checkData()
{
	var initData = localStorage.getItem("SizmekZendeskExtension");
	origSETTINGs = SZE;
	if(typeof(initData)!="undefined"&&initData!=null) SZE = JSON.parse(initData);
	else
	{
		localStorage.setItem("SizmekZendeskExtension", JSON.stringify(SZE));
		initData = localStorage.getItem("SizmekZendeskExtension");
		SZE = JSON.parse(initData);
	}
	checkVersion();
}

function checkVersion()
{	
	if(origSETTINGs.SETTINGs.version!=SZE.SETTINGs.version)
	{
		alert("There is a newer version of the Sizmek Zendesk Extension. Data will be set to default and will apply new data mapping.");
		resetData();
	}
}

//start me up
try 
{
	init();
	setDateTimeValue();
	checkData();
	extensionInterval = setInterval(function(){determineSLAs()}, 1000);
	placeIconsOnPage();
	setTimeout(autoRefresh(), 2000);
} 
catch(e) {console.log("error: " + e);}