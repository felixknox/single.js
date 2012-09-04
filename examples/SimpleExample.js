$(window).ready(function()
{
	$.getJSON("assets/json/data.json", bind(window, window.onLoaded));
});

function onLoaded(data)
{
	RSSA.init(	{
					enabledDebug: true,
					title: "Title when node has no Title",
					connectPagesWithAnimation: false
				}, data);
}

var AnimationPage = RSSA.default.BasicPage.extend(
{
	animateIn: function()
	{
		$(this._el).css("opacity", 0);
		$(this._el).animate({"opacity": 1}, 800);
	},
	animateOut: function()
	{
		$(this._el).animate({"opacity": 0}, {
			duration: 800,
			complete: bind(this, this._super)
		});
	}
});