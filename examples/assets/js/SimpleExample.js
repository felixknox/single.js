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
	JW.init(	{
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
	Menu.init();
};

var Menu = {
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
								'<a data-toggle="dropdown" class="dropdown-toggle" href="#">Site menu (from JSON) <b class="caret"></b></a>'+
							'</li>'+
						'</ul>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>');

		this.nav = $("#site .navbar .nav .dropdown");

		this.createMenuLevel(JW.core.pathModel.rootNode.id, JW.core.pathModel.rootNode.childNodes, this.nav);

		// init bootstrap jQuery module
		$('.dropdown-toggle').dropdown();

		// connect the menu nodes with the JW framework.
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
				var linkNode = JW.core.pathModel.getNode($(this).attr("data-url"));
				linkNode.requestNodeLaunch();
			});
		});
	}
};

// extend DefaultPage and make your own implementation (SimplePage is referenced from json/simple.json)
var SimplePage = JW.default.BasicPage.extend(
{
	print: function()
	{
		this._el.append("<h3>Instance of SimplePage Class</h3>");
		this._super();
	}
});

// extend DefaultPage and make your own implementation, this w. an animation implementation (AnimationPage is referenced from json/simple.json)
var AnimationPage = JW.default.BasicPage.extend(
{
	print: function()
	{
		this._el.append("<h3>Instance of AnimationPage Class</h3>");
		this._super();
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
	}
});