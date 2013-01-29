// AnimationExample
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