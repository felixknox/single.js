RSSA.default =
{
	/* Basic page */
	BasicPage: Class.extend({
		_el: null,
		dataNode: null,

		init: function(node)
		{
			//constructor
			if(!node) throw new Error("Page (RSSA.default.BasicPage) error: missing data node.");

			log("new BasicPage", node);

			this.dataNode = node;

			RSSA.SIGNALS.pageStatus.dispatch("init", this);
		},
		setup: function()
		{
			//DOM manipulation.
			this._el = $("body").append("<div id='"+this.dataNode.id+"'>id: "+this.dataNode.id+" >> title: "+this.dataNode.title+"</div>").find("#"+this.dataNode.id);
			this.resize();
		},
		animateIn: function()
		{
			//method will be called from model just after instantiation.
			RSSA.SIGNALS.pageStatus.dispatch("in", this);
		},
		animateOut: function()
		{
			//overwrite if the need for a page out animation, but for god sake, remember to call dealoc!
			RSSA.SIGNALS.pageStatus.dispatch("out", this);
		},
		dealoc: function()
		{
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