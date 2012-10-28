Single.debug =
{
	enabled: false,

	_el: null,
	_open: true,

	init: function(rootNode)
	{
		if(!window.jQuery)
			throw new Error("Single debug requires jQuery to work");
		this.enabled = true;

		//requires jQuery to work, throw error if jQuery is not present.
		Single.SIGNALS.pageCreated.add(this.onPageChange, this);
		this._el = $("body").prepend("<div id='Single-debug'><div style='line-height: 14px; background: #000000; color: #ffffff; display: block; margin-left: 10px; margin-top: 10px; width: 275px;'>!! Debug menu<br />Only use during development.</div></div>").find("#Single-debug");
		this.buildTree(rootNode, this._el);

		this.addStyle();

		$("#Single-debug").addClass("open");

		if(Single.currentNode) this.onPageChange(Single.currentNode);
	},
	addStyle: function()
	{
		var css = "html,body{width:100%;height:100%;}"+
"#Single-debug{background:#e7e7e7;font-family:Georgia, Verdana;font-size:11px;line-height:11px;padding-right:10px;box-shadow:6px 7px 8px -4px #e7e7e7;overflow:auto;width:0;height:100%;position:fixed;z-index:9999999999999999;top:0;left:0;transition:width .5s cubic-bezier(0.190,1.000,0.220,1.000);-moz-transition:width .5s cubic-bezier(0.190,1.000,0.220,1.000);-webkit-transition:width .5s cubic-bezier(0.190,1.000,0.220,1.000);-o-transition:width .5s cubic-bezier(0.190,1.000,0.220,1.000);margin:0;}"+
"#Single-debug.open{width:300px;}"+
"#Single-debug ul{overflow:hidden;margin:0;padding:0 0 0 15px;}"+
"#Single-debug > ul{margin-top:10px;margin-bottom:10px;padding:0 0 0 10px;}"+
"#Single-debug ul li{border:1px solid #fafafa;cursor:pointer;opacity:1;list-style:none;background:white;width:300px;transition:margin .25s cubic-bezier(0.190,1.000,0.220,1.000);-moz-transition:margin .25s cubic-bezier(0.190,1.000,0.220,1.000);-webkit-transition:margin .25s cubic-bezier(0.190,1.000,0.220,1.000);-o-transition:margin .25s cubic-bezier(0.190,1.000,0.220,1.000);margin:0;padding:4px 2px 4px 6px;}"+
"#Single-debug ul li.selected:before{content:'> ';}"+
"#Single-debug ul li.selected{background:#000000;color:#ffffff;margin:10px 0;}"+
"#Single-debug ul li.prev-selected{background:#e9e9e9;}"+
"#Single-debug ul li:hover{opacity:.7;}";

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
				$("#Single-debug").addClass("open");
			else
				$("#Single-debug").removeClass("open");
		}
	},
	buildTree: function(node, el)
	{
		var cn = node.childNodes,
			container,
			btn = null;

		if(node.isRootNode)
		{
			container = el.append("<ul id='rootnode-wrapper'></ul>").find("ul#rootnode-wrapper");
			btn = new Single.DebugBtn(node, container.append("<li id='"+node.id+"-btn'><span>"+node.title+"</span></li>").find("#"+node.id+"-btn"));
			
			container = container.append("<ul id='"+node.id+"-wrapper'></ul>").find("ul#"+node.id+"-wrapper");
		}else
		{
			container = el.append("<ul id='"+node.id+"-wrapper'></ul>").find("ul#"+node.id+"-wrapper");
		}

		for (var i = 0; i < cn.length; i++)
		{
			var title = cn[i].title === undefined ? cn[i].path.split("/").join("") : cn[i].title;
			btn = new Single.DebugBtn(cn[i], container.append("<li id='"+cn[i].id+"-btn'><span>"+title+"</span></li>").find("#"+cn[i].id+"-btn"));

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
Single.DebugBtn = Class.extend({
	_node: "",
	_el: null,

	init: function(node, el)
	{
		this._el = el;
		this._node = node;
		this._el.click(bind(this, this.onClick));
	},
	onClick: function(event)
	{
		if($(event.target).hasClass(".collapse-icon")) return;

		this._node.requestNodeLaunch();

		var that = this;
		setTimeout(function() { log("isSiblingOf previous node:", that._node.isSiblingOf(Single.previousNode)); }, 10);
	}
});

