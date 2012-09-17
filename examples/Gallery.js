$(window).ready(function()
{
	$.getJSON("examples/assets/json/gallery.json", bind(window, window.onLoaded));
});

function onLoaded(data)
{
	RSSA.init(	{
					enabledDebug: true,
					title: "Title when node has no Title",
					//enabled google analytics.
					enableTracking: true
				}, data, $("#site"));
}

var GalleryExample = {
	pages:
	{
		GalleryBasic: RSSA.default.BasicPage.extend({
			print: function()
			{
				var output = Mustache.render("<h1>{{title}}</h1><h2>{{body}}</h2><a href='{{link}}'>{{link-description}}</a></section>", this.dataNode.pageData);
				this._el.append(output);
				this._el.addClass("gallery-text");

				if(this.dataNode.pageData.link)
				{
					var linkNode = RSSA.paths.getNode(this.dataNode.pageData.link);
					this._el.find("a").click(function(event)
					{
						event.preventDefault();
						linkNode.requestNodeLaunch();
					});
				}
			}
		}),
		GalleryGrid: RSSA.default.BasicPage.extend({
			print: function()
			{
				var output = Mustache.render(
					"<ul>{{#childNodes}}"+
						"<li>{{pageData.title}}<br>"+
						"<img src='{{pageData.picture}}' />"+
						"</li>"+
					"{{/childNodes}}</ul>", this.dataNode);

				this._el.append(output);
				
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
		GalleryImage: RSSA.default.BasicPage.extend({
			print: function()
			{
				var output = Mustache.render(
					"<div class='gallery-image'>"+
						"<h2>'{{data.path}}'</h2>"+
						"<img src='{{pageData.big_picture}}' />"+
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
				var w = img.width() * 0.5;
				var h = img.height() * 0.5;
				img.css({
					"visibility": "visible",
					"opacity": 0,
					"margin-left": -w,
					"margin-top": -h});
				img.animate({"opacity": 1}, 400);
			}
		})
	}
};
