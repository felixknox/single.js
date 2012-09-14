$(window).ready(function()
{
	$.getJSON("assets/json/data.json", bind(window, window.onLoaded));
});

function onLoaded(data)
{
	RSSA.init(	{
					enabledDebug: true,
					title: "Title when node has no Title",
					//enabled google analytics.
					enableTracking: true //https://developers.google.com/analytics/devguides/collection/gajs/
				}, data, $("body"));
}

var AnimationPage = RSSA.default.BasicPage.extend(
{
	animate: function()
	{
		//don't call this._super if you wanna animate.
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