RSSA.debug =
{
	enabled: false,

	_el: null,
	_open: true,

	init: function(rootNode)
	{
		if(!window.jQuery)
			throw new Error("RSSA debug requires jQuery to work");
		this.enabled = true;

		//requires jQuery to work, throw error if jQuery is not present.
		RSSA.SIGNALS.newPage.add(this.onPageChange, this);
		this._el = $("body").prepend("<div id='rssa-debug'></div>").find("#rssa-debug");
		this.buildTree(rootNode, this._el);

		this.addStyle();

		$("#rssa-debug").addClass("open");

		this.onPageChange(RSSA.currentNode);
	},
	addStyle: function()
	{
		var css = "";
		//var css = "body{background: #00ff00;}";

		head = document.getElementsByTagName('head')[0],
		style = document.createElement('style');
		style.type = 'text/css';
		if(style.styleSheet){
			style.styleSheet.cssText = css;
		}else{
			style.appendChild(document.createTextNode(css));
		}

		head.appendChild(style);

		//if mobile or tablet
		//open the menu always, else add mousemove.
		$(document).mousemove(bind(this, this.onMouseMove));
	},
	onMouseMove: function(event)
	{
		var cur = this._open;
		this._open = event.pageX <= (this._open ? 250 : 40);
		
		if(cur != this._open)
		{
			if(this._open)
				$("#rssa-debug").addClass("open");
			else
				$("#rssa-debug").removeClass("open");
		}
	},
	buildTree: function(node, el)
	{
		var cn = node.childNodes,
			container = el.append("<ul id='"+node.id+"-wrapper'></ul>").find("ul#"+node.id+"-wrapper"),
			btn = null;

		for (var i = 0; i < cn.length; i++)
		{
			btn = new RSSA.DebugBtn(cn[i], container.append("<li id='"+cn[i].id+"-btn'><span>"+cn[i].title+"</span></li>").find("#"+cn[i].id+"-btn"));

			if(cn[i].childNodes.length > 0)
			{
				this.buildTree(cn[i], container);
			}
		}
	},
	onPageChange: function(currentNode, previousNode)
	{
		this._el.find("li").removeClass("prev-selected");
		this._el.find("li").removeClass("selected");

		if(previousNode)
		{
			this._el.find("li#"+previousNode.id+"-btn").addClass("prev-selected");
		}

		this._el.find("li#"+currentNode.id+"-btn").addClass("selected");
	}
},
RSSA.DebugBtn = Class.extend({
	_node: "",
	_el: null,

	init: function(node, el)
	{
		this._el = el;
		this._node = node;
		this._el.click(bind(this, this.onClick));
		this._el.height(this._el.find("> span").height());
	},
	onClick: function(event)
	{
		if($(event.target).hasClass(".collapse-icon")) return;

		this._node.requestNodeLaunch();

		var that = this;
		setTimeout(function() { log("isSiblingOf previous node:", that._node.isSiblingOf(RSSA.previousNode)); }, 10);
	}
});

