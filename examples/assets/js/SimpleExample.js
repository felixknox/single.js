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
					forceHashTag: true
				}, data, $("#site"));

	// create our own menu, using the bootstrap dropdown module
	SimpleExampleMenu.init();
};

var SimpleExampleMenu = {
	nav: null,
	init: function()
	{
		// append
		$("#site").append(''+
		'<div class="navbar navbar-fixed-top">'+
			'<div class="navbar-inner">'+
				'<div class="container-fluid">'+
					'<div class="nav-collapse">'+
						'<ul class="nav">'+
							'<li class="dropdown">'+
								'<a data-toggle="dropdown" class="dropdown-toggle" href="#"><b>Site menu (from JSON)</b> <b class="caret"></b></a>'+
							'</li>'+
						'</ul>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>');

		this.nav = $("#site .navbar .nav .dropdown");

		this.createMenuLevel(Single.core.pathModel.rootNode.id, Single.core.pathModel.rootNode.childNodes, this.nav);

		// init bootstrap jQuery module
		$('.dropdown-toggle').dropdown();

		// connect the menu nodes with the Single framework.
		this.connectMenuNodesWithFramework();
	},
	createMenuLevel: function(id, nodes, container)
	{
		var currentNav = $(container).append('<ul id="'+id+'" class="dropdown-menu"></ul>').find("ul#"+id), that = this;
		$(nodes).each(function(i, el)
		{
			if(el.childNodes && el.childNodes.length > 0)
			{
				currentNav.append('<li class="dropdown-submenu"><a data-url="'+el.fullPath+'" href="#">'+el.fullPath+'</a><ul id="'+el.id+'" class="dropdown-menu"></ul></li>');
				that.createMenuLevel(el.id, el.childNodes, currentNav);
			}else
			{
				currentNav.append('<li><a data-url="'+el.fullPath+'" id="'+el.id+'" href="#">'+el.fullPath+'</a></li>');
			}
		});
	},
	connectMenuNodesWithFramework: function()
	{
		this.nav.find("a:not(.dropdown-toggle)").each(function(i, el)
		{
			$(el).click(function(event)
			{
				event.preventDefault();
				var linkNode = Single.core.pathModel.getNode($(this).attr("data-url"));
				linkNode.requestNodeLaunch();
			});
		});
	}
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

// extend DefaultPage and make your own implementation, this w. an animation implementation (SimpleExampleAnimationPage is referenced from json/simple.json)
var SimpleExampleAnimationPage = SimpleExamplePage.extend(
{
	_el: null,
	printTitle: function()
	{
		this._el.append("<h1>"+this.dataNode.pageData.title+"</h1><p> (Instance of SimpleExampleAnimationPage Class)</p>");
	},
	animate: function()
	{
		// don't call "this._super();" if you wanna animate freely. But remember to call framework hooks "onAnimatedIn" and "onAnimatedOut" when done animating.
		// this._super();

		$(this._el).stop(true);

		if(this._state === "ANIMATING_IN")
		{
			$(this._el).css("opacity", 0).animate({"opacity": 1},
			{
				duration: 800,
				// remember to call this.onAnimatedIn
				complete: bind(this, this.onAnimatedIn)
			});
		}
		else if(this._state === "ANIMATING_OUT")
		{
			$(this._el).css("opacity", 1).animate({"opacity": 0},
			{
				duration: 800,
				// remember to call this.onAnimatedOut
				complete: bind(this, this.onAnimatedOut)
			});
		}
	},
	dealoc: function()
	{
		//override
		this._el.remove();
		this._el = null;
	}
});