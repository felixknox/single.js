// gallery example; shows how to use:
// the node structure to creat your own UI (gallery thumbs, overlay image)
// we are using Mustache to show the flexibility to use what ever templating framework/implementation you want to.

$(window).ready(function()
{
	// load JSON.
	$.getJSON("assets/json/gallery.json", bind(window, window.onLoaded));
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
}

var GalleryExample = {
	pages:
	{
		GalleryBasic: JW.default.BasicPage.extend({
			print: function()
			{
				var output = Mustache.render("<h1>{{title}}</h1><h2>{{& body}}</h2><a href='{{& link}}'>{{link-description}}</a></section>", this.dataNode.pageData);
				this._el.append(output);
				this._el.addClass("gallery-text");

				if(this.dataNode.pageData.link)
				{
					// get a node from an URL snippet.
					var linkNode = JW.core.pathModel.getNode(this.dataNode.pageData.link);
					this._el.find("a").click(function(event)
					{
						event.preventDefault();
						// requestNodeLaunch is a hook into the framework. Basiclly your way to call a page.
						linkNode.requestNodeLaunch();
					});
				}
			}
		}),
		GalleryGrid: JW.default.BasicPage.extend({
			print: function()
			{
				var output = Mustache.render(
					"<a class='home-button'>Go to /home</a>"+
					"<ul>{{#childNodes}}"+
						"<li>"+
							"<div>{{index}}</div>"+
						"</li>"+
					"{{/childNodes}}</ul>", this.dataNode);

				this._el.append(output);

				this._el.find("a.home-button").click(function()
				{
					JW.core.pathModel.rootNode.requestNodeLaunch();
				});
				
				var that = this;
				this._el.find("li").each(function(i, el)
				{
					$(el).click(function()
					{
						that.dataNode.childNodes[i].requestNodeLaunch();
					});
				});
			}
		}),
		GalleryImage: JW.default.BasicPage.extend({
			print: function()
			{
				var output = Mustache.render(
					"<div class='gallery-image'>"+
						"<div class='gallery-image-wrapper'>"+
							"<img src='{{pageData.big_picture}}' />"+
							"<h2>{{data.title}}</h2>"+
						"</div>"+
					"</div>", this.dataNode);

				this._el.append(output);
				this._el.find("img").load(bind(this, this.onLoaded));
				this._el.addClass("gallery-overlay");

				var parentNode = this.dataNode.parent;
				this._el.click(function()
				{
					parentNode.requestNodeLaunch();
				});
			},
			onLoaded: function()
			{
				var img = $(this._el.find("img"));
				var newHeight = $(window).height()-150;
				img.height(newHeight);

				var w = img.width() * 0.5;
				var h = (img.height() * 0.5) + 50;
				this._el.find(".gallery-image-wrapper").css({
					"visibility": "visible",
					"opacity": 0,
					"margin-left": -w,
					"margin-top": -h
				});

				this._el.find(".gallery-image-wrapper").animate({"opacity": 1, ease: "ease-out"}, 400);

				$("#site").addClass("overlay");
			},
			animate: function()
			{
				if(this._state === "ANIMATING_IN")
					this._super();
				else if(this._state === "ANIMATING_OUT")
				{
					$("#site").removeClass("overlay");
					$(this._el).css("opacity", 1).animate({"opacity": 0, ease: "ease-out"},
					{
						duration: 400,
						complete: bind(this, this.onAnimatedOut)
					});
				}
			},
		})
	}
};
