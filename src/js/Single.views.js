Single.views =
{
	randomId: 0,
	getUniqueId: function()
	{
		var id = this.randomId;
		this.randomId++;
		return "JW_p"+id.toString();
	},
	/* Basic page */
	BasicPage: Class.extend({
		_buildId: -1,

		_container: null,
		_state: "",
		dataNode: null,

		/**
			* @param {Pathnode} node
		*/

		init: function(node)
		{
			this._buildId = Single.views.getUniqueId();
			//constructor
			if(!node) throw new Error("Page (Single.views.BasicPage) error: missing data node.");

			this.dataNode = node;

			Single.SIGNALS.pageStatus.dispatch("init", this);
		},
		setup: function(container)
		{
			this._state = "SETUP";

			//DOM manipulation.
			this._container = container;

			this.print();
			this.resize();
		},
		print: function()
		{
			//Should be overwritten.
			console.log("node id: "+this.dataNode.id);
			console.log("node relative path: "+this.dataNode.path);
			console.log("node full path: "+this.dataNode.fullPath);
			
			console.log("nested: "+(this.dataNode.nested ? "YES" : "NO"));
			console.log("overlay: "+(this.dataNode.overlay ? "YES" : "NO"));

			for(var i in this.dataNode.pageData)
				console.log("param in pageData: id: "+i.toString()+" value: "+String(this.dataNode.pageData[i]));
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
			Single.SIGNALS.pageStatus.dispatch("in", this);
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
			Single.SIGNALS.pageStatus.dispatch("out", this);

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
			this.dataNode = null;
			Single.SIGNALS.pageStatus.dispatch("dealoc", this);
		},
		resize: function()
		{
			
		}
	})
};