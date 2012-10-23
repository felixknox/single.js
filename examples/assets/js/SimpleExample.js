$(window).ready(function()
{
	$.getJSON("assets/json/simple.json", bind(window, window.onLoaded));
});

function onLoaded(data)
{
	JW.init(	{
					enabledDebug: true,
					title: "Title when node has no Title",
					//enabled google analytics.
					enableTracking: true
				}, data, $("body"));
}

var AnimationPage = JW.default.BasicPage.extend(
{
	animate: function()
	{
		//don't call "this._super();" if you wanna animate freely
		//this._super();

		$(this._el).stop(true);

		if(this._state === "ANIMATING_IN")
		{
			$(this._el).css("opacity", 0).animate({"opacity": 1},
			{
				duration: 800,
				complete: bind(this, this.onAnimatedIn)
			});
		}
		else if(this._state === "ANIMATING_OUT")
		{
			$(this._el).css("opacity", 1).animate({"opacity": 0},
			{
				duration: 800,
				complete: bind(this, this.onAnimatedOut)
			});
		}
	}
});