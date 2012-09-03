RSSA.debug =
{
	_el: null,
	_open: false,

	init: function(rootNode)
	{
		//requires jQuery to work.
		RSSA.SIGNALS.newPage.add(this.onPageChange, this);
		this._el = $("body").prepend("<div id='rssa-debug'></div>").find("#rssa-debug");
		this.buildTree(rootNode, this._el);

		this.addStyle();

		this.onPageChange(RSSA.pages.currentNode);
	},
	addStyle: function()
	{
		var css =
					"#rssa-debug {"+
						"background: black;"+
						"width: 0px;"+
						"height: 100%;"+
						"overflow: hidden;"+
						"float: left;"+
					"}"+
					"#rssa-debug.open {"+
						"width: 200px"+
					"}"+
					"li {"+
						"background: white;"+
					"}"+
					"li.selected {"+
						"background: green;"+
					"}"+
					"li.prev-selected {"+
						"background: red;"+
					"}",
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
		this._open = event.pageX <= 200;
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
			btn = new RSSA.debugBtn(cn[i], container.append("<li id='"+cn[i].id+"-btn'>"+cn[i].id+"</li>").find("#"+cn[i].id+"-btn"));
			if(cn[i].childNodes.length > 0)
				this.buildTree(cn[i], container);
		}
	},
	onPageChange: function(currentNode, previousNode)
	{
		this._el.find("li").removeClass("prev-selected");

		if(previousNode)
		{
			this._el.find("li#"+previousNode.id+"-btn").removeClass("selected");
			this._el.find("li#"+previousNode.id+"-btn").addClass("prev-selected");
		}

		this._el.find("li#"+currentNode.id+"-btn").addClass("selected");
	}
},
RSSA.debugBtn = Class.extend({
	_node: "",
	init: function(node, el)
	{
		this._node = node;
		el.click(bind(this, this.onClick));
	},
	onClick: function(event)
	{
		this._node.requestNodeLaunch();
	}
});