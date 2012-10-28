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

		_el: null,
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
			this._el = this._container.append("<div style='margin-left: 235px; margin-top: 50px;' id='"+this._buildId+"'></div>").find("#"+this._buildId);

			this.print();
			this.resize();
		},
		print: function()
		{
			//Should be overwritten.
			this._el.css("border", "1px solid #e7e7e7");
			this._el.append("<div>node id: <b>"+this.dataNode.id+"</b></div>");
			this._el.append("<div>node relative path: <b>"+this.dataNode.path+"</b></div>");
			this._el.append("<div>node full path: <b>"+this.dataNode.fullPath+"</b></div>");
			this._el.append("<br />");

			if(this.dataNode.nested || this.dataNode.overlay)
			{
				if(this.dataNode.nested)
					this._el.append("<div style='background: #000000; color: #ffffff '>page is of <b>nested</b> type. Parent page will open (parent url: "+this.dataNode.parent.fullPath+")</div>");
				else
					this._el.append("<div style='background: #333333; color: #ffffff '>page is of <b>overlay</b> type (will not remove the previusly opened page)</div>");
				this._el.append("<br />");
			}
			for(var i in this.dataNode.pageData)
			{
				this._el.append("<div>PageData, id: <b>"+i.toString()+"</b> value: <b>"+String(this.dataNode.pageData[i])+"</b></div>");
			}
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
			//remove from memory.
			this._el.remove();
			this._el = null;
			this.dataNode = null;

			Single.SIGNALS.pageStatus.dispatch("dealoc", this);
		},
		resize: function()
		{
			
		}
	})
};