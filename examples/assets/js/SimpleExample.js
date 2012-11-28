// simple example; shows how to use:
// the node structure to generate a menu.
// create your own pages, where logic can be inserted.

$(window).ready(function()
{
	// load JSON.
	$.getJSON("assets/json/simple.json", bind(window, window.onLoaded));
});

function onLoaded(data)
{
	// init the framework when data has loaded.
	Single.init(	{
					// enable debug menu for development purpose only.
					enabledDebug: true,
					// add a default title.
					title: "Title when node has no Title",
					// enabled google analytics.
					enableTracking: true,
					// exclude "forceHashTag" to let the framework find out if it should use HTML5 History or hashtags.
					forceHashTag: true,
					
					cachePages: true
				}, data, $("#site"));

	// create our own menu, using the bootstrap dropdown module
	SimpleExampleMenu.init();
};

// extend DefaultPage and make your own implementation (SimpleExamplePage is referenced from json/simple.json)
var SimpleExamplePage = Single.views.BasicPage.extend(
{
	_el: null,
	print: function()
	{
		//override
		this._el = this._container.append("<div class='hero-unit' style='margin-left: 20px; margin-top: 50px;' id='"+this._buildId+"'></div>").find("#"+this._buildId);
		this.printTitle();
		this._el.css("border", "1px solid #e7e7e7");
		this._el.append("<p>node id: <b>"+this.dataNode.id+"</b></p>");
		this._el.append("<p>node relative path: <b>"+this.dataNode.path+"</b></p>");
		this._el.append("<p>node full path: <b>"+this.dataNode.fullPath+"</b></p>");

		if(this.dataNode.nested || this.dataNode.overlay)
		{
			this._el.addClass(this.dataNode.nested ? "nested" : "overlay");
			if(this.dataNode.nested)
				this._el.append("<div class='alert' >page is of <b>nested</b> type. Parent page will open (parent url: "+this.dataNode.parent.fullPath+")</div>");
			else
				this._el.append("<div class='alert' >page is of <b>overlay</b> type (will not remove the previusly opened page)</div>");
		}

		for(var i in this.dataNode.pageData)
		{
			this._el.append("<p>PageData, id: <b>"+i.toString()+"</b> value: <b>"+String(this.dataNode.pageData[i])+"</b></p>");
		}
	},
	printTitle: function()
	{
		this._el.append("<h1>"+this.dataNode.pageData.title+"</h1><p> (Instance of SimplePage Class)</p>");
	},
	dealoc: function()
	{
		//override
		this._el.remove();
		this._el = null;
	}
});