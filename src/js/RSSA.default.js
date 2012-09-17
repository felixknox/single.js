RSSA.default =
{
	randomId: 0,
	getUniqueId: function()
	{
		var id = this.randomId;
		this.randomId++;
		return "rssa_p"+id.toString();
	},
	/* Basic page */
	BasicPage: Class.extend({
		_buildId: -1,

		_el: null,
		_container: null,
		_state: "",
		dataNode: null,

		init: function(node)
		{
			this._buildId = RSSA.default.getUniqueId();
			//constructor
			if(!node) throw new Error("Page (RSSA.default.BasicPage) error: missing data node.");

			this.dataNode = node;

			RSSA.SIGNALS.pageStatus.dispatch("init", this);
		},
		setup: function(container)
		{
			this._state = "SETUP";

			//DOM manipulation.
			this._container = container;
			this._el = this._container.append("<div id='"+this._buildId+"'></div>").find("#"+this._buildId);

			this.print();
			this.resize();
		},
		print: function()
		{
			this._el.text("id: "+this.dataNode.id+" >> path: "+this.dataNode.data.path);
		},
		animateIn: function()
		{
			//method will be called from model just after instantiation.
			this._state = "ANIMATING_IN";
			this.animate();
		},
		onAnimatedIn: function()
		{
			this._state = "ANIMATED_IN";
			RSSA.SIGNALS.pageStatus.dispatch("in", this);
		},
		animateOut: function()
		{
			//overwrite if the need for a page out animation, but for god sake, remember to call dealoc!
			this._state = "ANIMATING_OUT";
			this.animate();
		},
		onAnimatedOut: function()
		{
			this._state = "ANIMATED_OUT";
			RSSA.SIGNALS.pageStatus.dispatch("out", this);

			this.dealoc();
		},
		animate: function()
		{
			// a method that should be overwritten if transitions between pages is wanted.
			if(this._state === "ANIMATING_IN")
				this.onAnimatedIn();
			else if(this._state === "ANIMATING_OUT")
				this.onAnimatedOut();
		},
		dealoc: function()
		{
			//remove from memory.
			this._el.remove();
			this._el = null;
			this.dataNode = null;

			RSSA.SIGNALS.pageStatus.dispatch("dealoc", this);
		},
		resize: function()
		{
			
		}
	})
};