RSSA.default =
{
	/* Basic page */
	BasicPage: Class.extend({
		_el: null,
		_dataNode: null,

		init: function(node)
		{
			if(!node) throw new Error("Page (RSSA.default.BasicPage) error: missing data node.");

			log("new BasicPage", node);

			this._dataNode = node;
			this.resize();
		},
		start: function()
		{
			//method will be called from model just after instantiation.
			this.resize();
		},
		remove: function()
		{
			//overwrite if the need for a page out animation, but for god sake, remember to call dealoc!
			this.dealoc();
		},
		dealoc: function()
		{
			this._el = null;
			this._dataNode = null;
		},
		resize: function()
		{
			
		}
	})
};