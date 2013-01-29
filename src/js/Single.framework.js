	/*  ___
  _/ ..\
 ( \  0/___
  \    \___)
  /     \
 /      _\
`"""""`` author: felix nielsen - felix . nielsen [ a ] rwatgg . dk */
Single =
{
	PAGE_TYPES: [],
	SIGNALS:
	{
		pageCreated: new signals.Signal(), //new page requested signal
		pageControlReady: new signals.Signal(), //when the data has been loaded
		pathSameSame: new signals.Signal(), // if path is the same, signals gets fired.
		pageStatus: new signals.Signal(), //with a value [String] of "in" or "out".
		pathChange: new signals.Signal(), //dispatches a signal containing the current path [String]
		path404: new signals.Signal()
	},

	core: {
		options: {
			// (Boolean) disable/enable debug menu. For development purpose only.
			enabledDebug: false,
			// (String) Default title, should be overwriten from the custom option object.
			title: "",
			// (Boolean) enabled google analytics.
			enableTracking: false,
			// (Boolean) true/false, false to let the framework find out if it should use HTML5 History or hashtag.
			forceHashTag: false,
			//cachePages
			cachePages: true
		}
	},

	//variables
	currentNode: null,
	previousNode: null
};
	
		
//
Single.init = function(options, data, pageContainer)
{
	this.core.options = options;
	if(data)
	{
		this.core.pages.init(data.pages, pageContainer);
		this.core.pathModel.setup(data.sitetree);

		if(options.enabledDebug)
			Single.debug.init(this.core.pathModel.rootNode);
	}

	if(options.enableTracking)
		Single.tracker.init();
};

/***
*    .______      ___       _______  _______   ______   ______   .__   __. .___________..______        ______    __
*    |   _  \    /   \     /  _____||   ____| /      | /  __  \  |  \ |  | |           ||   _  \      /  __  \  |  |
*    |  |_)  |  /  ^  \   |  |  __  |  |__   |  ,----'|  |  |  | |   \|  | `---|  |----`|  |_)  |    |  |  |  | |  |
*    |   ___/  /  /_\  \  |  | |_ | |   __|  |  |     |  |  |  | |  . `  |     |  |     |      /     |  |  |  | |  |
*    |  |     /  _____  \ |  |__| | |  |____ |  `----.|  `--'  | |  |\   |     |  |     |  |\  \----.|  `--'  | |  `----.
*    | _|    /__/     \__\ \______| |_______| \______| \______/  |__| \__|     |__|     | _| `._____| \______/  |_______|
*/
//Controls the pages of the app. When a new page gets requested via the pageControl (calls a HTTP receiver)
//It waits for proper feedback from the server, removes old page and shows the new page.

Single.core.pages =
{
	currentPage: null,
	currentOverlayPage: null,
	currentNestedPage: null,

	pageContainer: null,

	_pagesData: null,

	init: function(data, container)
	{
		this.pageContainer = container;

		Single.SIGNALS.pageStatus.add(this.onPageStatusChange, this);
		this._pagesData = [];
		for (var i = 0; i < data.length; i++) {
			this.addPageData(data[i].dataId, data[i]);
		}
	},
	addPageData: function(id, data)
	{
		this._pagesData[id] = data;
	},
	requestNewPage: function(path)
	{
		//request a new page from a specific path, used for when you don't have a reference to a node.
		var node = Single.core.pathModel.getNode(path);
		node.requestNodeLaunch();
	},
	onNewPageRequested: function(currentNode, path)
	{
		var isReadyForPageChange = !Single.previousNode || ((Single.previousNode.overlay || Single.previousNode.nested) && Single.previousNode.parent !== currentNode) || (Single.previousNode !== currentNode && (!Single.previousNode.nested && !Single.previousNode.overlay));

		if(!currentNode.overlay && !currentNode.nested)
		{
			if(isReadyForPageChange)
				this.removeOldPage();
		}

		//always remove overlay page when changing page.
		this.removeOldOverlayPage();
		
		this.removeOldNestedPage();
		
		//debug.
		if(Single.debug.enabled) log("pageControl > onNewPageRequested:", path, currentNode);
		
		//build the data and class.
		var _class = Single.tools.stringToFunction(currentNode.pageData.page);
		
		//check the type of page, and setup accordingly.
		if(currentNode.overlay)
		{
			this.setupOverlayPage(_class, currentNode);
		}
		else if(currentNode.nested)
		{
			this.setupNestedPage(_class, currentNode);

			if(this.currentPage && this.currentPage.dataNode.dataId !== currentNode.parent.dataId)
			{
				//there is a current page, but it is not the parent of the nested page, therefore remove it and setup parent.
				this.removeOldPage();

				_class = Single.tools.stringToFunction(currentNode.parent.pageData.page);
				this.setupPage(_class, currentNode.parent);
			}else if(this.currentPage && this.currentPage.dataNode.dataId === currentNode.parent.dataId)
			{
				//current page is parent of nested page, therefore animate nestedpage in
				this.currentNestedPage.animateIn();
			}else if(!this.currentPage)
			{
				//no current page, therefore set it up.
				_class = Single.tools.stringToFunction(currentNode.parent.pageData.page);
				this.setupPage(_class, currentNode.parent);
			}
		}else
		{
			//just setup the page.
			if(isReadyForPageChange)
				this.setupPage(_class, currentNode);
		}

		//dispatch a signal about the new page for all the listeners.
		Single.SIGNALS.pageCreated.dispatch(Single.currentNode, Single.previousNode);
	},
	//Page setup
	setupOverlayPage: function(c, node)
	{
		this.currentOverlayPage = this.getNewPageNode(c, node);
		this.currentOverlayPage.setup(this.pageContainer);
		this.currentOverlayPage.animateIn();

		//set the page of the currentNode (for deepbinding reference)
		Single.currentNode.page = this.currentOverlayPage;
	},
	setupNestedPage: function(c, node)
	{
		this.currentNestedPage = this.getNewPageNode(c, node);
		//only setup the nested page if there is a current page, else the nested page have to wait.
		if(this.currentPage && this.currentPage.dataNode === node.parent)
			this.currentNestedPage.setup(this.pageContainer);

		//set the page of the currentNode (for deepbinding reference)
		Single.currentNode.page = this.currentNestedPage;
	},
	setupPage: function(c, node)
	{
		this.currentPage = this.getNewPageNode(c, node);
		this.currentPage.setup(this.pageContainer);
		this.currentPage.animateIn();

		//setup and animate nested page in as well.
		if(this.currentNestedPage)
		{
			this.currentNestedPage.setup(this.pageContainer);
		}

		//set the page of the currentNode (for deepbinding reference)
		Single.currentNode.page = this.currentPage;
	},
	getNewPageNode: function(c, node)
	{
		//check if page caching is enabled.
		var p;
		if(Single.core.options.cachePages && this.cache.has(node.id))
			p = this.cache.get(node.id);
		else
			p = new c(node);
		return p;
	},

	//removal of the pages.
	removeOldPage: function()
	{
		if(Single.currentNode)
		{
			Single.currentNode.page = null;
		}

		if(this.currentPage)
		{
			this.currentPage.animateOut();

			if(Single.core.options.cachePages && !this.cache.has(this.currentPage))
				this.cache.add(this.currentPage.dataNode.id, this.currentPage);
		}

		this.currentPage = null;
	},
	removeOldOverlayPage: function()
	{
		if(Single.currentNode)
		{
			Single.currentNode.page = null;
		}

		if(this.currentOverlayPage)
		{
			this.currentOverlayPage.animateOut();

			if(Single.core.options.cachePages && !this.cache.has(this.currentOverlayPage))
				this.cache.add(this.currentOverlayPage.dataNode.id, this.currentOverlayPage);
		}

		this.currentOverlayPage = null;
	},
	removeOldNestedPage: function()
	{
		if(this.currentNestedPage)
		{
			this.currentNestedPage.animateOut();

			if(Single.core.options.cachePages && !this.cache.has(this.currentNestedPage))
				this.cache.add(this.currentNestedPage.dataNode.id, this.currentNestedPage);
		}

		this.currentNestedPage = null;
	},
	onPageStatusChange: function(type /* "in" or "out"*/, page)
	{
		
	},
	getPageData: function(node)
	{
		node.pageData = this._pagesData[node.dataId];
		return node.pageData;
	}
};

Single.core.pages.cache =
{
	data: [],
	add: function(id, page)
	{
		this.data[id] = page;
	},
	get: function(id)
	{
		if(!this.has(id))
			throw new Error("page is not cached exist!");
		return this.data[id];
	},
	has: function(data)
	{
		if(this.data.length === 0)
			return false;

		if(typeof data === "string" && this.data[data] !== undefined)
			return true;
		else
		{
			for(var i in this.data)
			{
				if(this.data[i] === data)
					return true;
			}

			return false;
		}

		return false;
	},
	remove: function()
	{

	}
};

/***
*    .______      ___   .___________. __    __  .___  ___.   ______    _______   _______  __
*    |   _  \    /   \  |           ||  |  |  | |   \/   |  /  __  \  |       \ |   ____||  |
*    |  |_)  |  /  ^  \ `---|  |----`|  |__|  | |  \  /  | |  |  |  | |  .--.  ||  |__   |  |
*    |   ___/  /  /_\  \    |  |     |   __   | |  |\/|  | |  |  |  | |  |  |  ||   __|  |  |
*    |  |     /  _____  \   |  |     |  |  |  | |  |  |  | |  `--'  | |  '--'  ||  |____ |  `----.
*    | _|    /__/     \__\  |__|     |__|  |__| |__|  |__|  \______/  |_______/ |_______||_______|
*/
//Controls the path of the application. Uses Path.js to handle crossbrowser issues.

Single.core.pathModel =
{
	//consts
	DEBUG_MODE: false,

	//vars
	currentPath: "",

	data: null,
	nodes: null,
	rootNode: null,

	randomId: 666,

	DEFAULT_TITLE: "",

	setup: function(data)
	{
		this.DEFAULT_TITLE = Single.core.options.title;
		this.data = data;
		this.nodes = [];

		//map rootNode
		this.map(this.data, this.data[0].path);

		var that = this;
		Path.rescue(function(){ that.on404(); });

		Single.SIGNALS.pageControlReady.dispatch();

		forceToHashtag = Single.core.options.forceHashTag;
		Path.history.listen(true);
	},
	bindable: function()
	{
		//scope of Path (this).
		//pathModel.onPathChange(this.path);
	},
	getUniqueId: function()
	{
		var id = this.randomId;
		this.randomId++;
		return "u"+id.toString();
	},
	getNode: function(path)
	{
		path = Single.tools.cleanPath(path);

		for (var i = 0; i < this.nodes.length; i++)
		{
			if(this.nodes[i].fullPath == path)
			{
				return this.nodes[i];
			}
		}

		return this.introNode;
	},
	onEnter: function (fns)
	{
		//scope of Path (this).
		Single.core.pathModel.onPathChange(this.path);
	},
	createNode: function(data, trailingPath, parentNode, index)
	{
		var isRootNode = this.rootNode === null;
		var pathNode = new PathNode(data, trailingPath, parentNode, this, index, isRootNode);
		this.nodes.push(pathNode);

		//sets root node (this.rootNode can be sat to something else than first child.)
		if(isRootNode)
		{
			this.rootNode = pathNode;
			Path.root(this.rootNode.fullPath);
		}

		this.mapNode(pathNode);

		return pathNode;
	},
	createSubNode: function(node, data, pageData /*optional*/)
	{
		var isRootNode = this.rootNode === null;
		var parentNode = node;
		//var pathNode = new PathNode(data, node.fullPath, parentNode, this, this.nodes.length, isRootNode);
		//this.nodes.push(pathNode);
		//this.mapNode(pathNode);
		//if(isRootNode)
		//{
			//this.rootNode = pathNode;
			//Path.root(this.rootNode.fullPath);
		//}
		//if(pageData)
		//{
			//if page data.
			//add page data, linked to the node.
			//Single.core.pages.addPageData(pathNode.id, pageData);
		//}
	},
	mapNode: function(pathNode)
	{
		Path.map(pathNode.fullPath).to(this.bindable).enter(this.onEnter);
		if(pathNode.fullPath.length > 1 && pathNode.fullPath.substr(pathNode.fullPath.length-1, 1) !== "/")
		{
			Path.map(pathNode.fullPath+"/").to(this.bindable).enter(this.onEnter);
		}
	},
	map: function(elems, trailingPath)
	{
		var ary = [];
		for (var i = 0; i < elems.length; i++)
		{
			if(elems[i] !== undefined) //|| elems[i].name !== undefined || elems[i].additional !== undefined)
			{
				var pd = elems[i].page !== undefined ? elems[i].page : elems[i];
				var pathNode = this.createNode(pd, trailingPath, this.getNode(trailingPath), i);
				ary.push(pathNode);

				if(pd.childNodes && pd.childNodes !== "" && pd.childNodes.length > 0)
				{
					pathNode.childNodes = this.map(pd.childNodes, pathNode.fullPath);
					this.mapNextAndPreviousChildnodes(pathNode.childNodes);
				}
			}
		}

		return ary;
	},
	mapNextAndPreviousChildnodes: function(childNodes)
	{
		var prev = childNodes[childNodes.length - 1],
			next;
		for (var i = 0; i < childNodes.length; i++)
		{
			next = i === childNodes.length - 1 ? childNodes[0] : childNodes[i+1];
			childNodes[i].setNextAndPreviousNode(prev, next);
			prev = childNodes[i];
		}
	},
	on404: function(params)
	{
		log("404: Path not found");
		Single.SIGNALS.path404.dispatch(params);
	},
	set: function(name, path)
	{
		if(Single.core.pages.currentNode && Single.core.pages.currentNode.fullPath === path)
		{
			// if path is the same, then it means a user has clicked an already active menu item, therefore we should reset the list.
			Single.SIGNALS.core.pathModelameSame.dispatch(Single.currentNode);
		}else
		{
			/* falls back to hash tag if HTML5 history is not supported */
			if(this.DEBUG_MODE) Path.history.pushState(null, name, "#"+path);
			else Path.history.pushState({}, name, path);
		}
	},
	setTitle: function(title)
	{
		document.title = title;
	},
	updateTitle: function()
	{
		if(this.getNode(this.currentPathNoHash).title === undefined)
		{
			if(this.getNode(this.currentPathNoHash).data.name !== undefined)
				this.setTitle(this.getNode(this.currentPathNoHash).data.name);
			else if(this.getNode(this.currentPathNoHash).data.label)
				this.setTitle(this.getNode(this.currentPathNoHash).data.label);
			else
				this.setTitle(this.DEFAULT_TITLE);
		}
		else
			this.setTitle(this.getNode(this.currentPathNoHash).title);
	},
	onPathChange: function(currentPath)
	{
		this.currentPath = currentPath;

		this.currentPathNoHash = currentPath.split("#").join("");
		
		Single.previousNode = Single.currentNode;
		Single.currentNode = this.getCurrentNode();

		Single.SIGNALS.pathChange.dispatch(this.currentPathNoHash);

		// only update the page if an dataId is set.
		// undefined dataId can be used if no HTML output is wanted (ex. a deeplinkable slideshow)
		if(Single.currentNode.dataId)
			Single.core.pages.onNewPageRequested(Single.currentNode, this.currentPathNoHash);

		this.updateTitle();
	},
	getCurrentNode: function()
	{
		return this.getNode(this.currentPathNoHash);
	},
	back: function()
	{
		if(window.history)
			window.history.back();
	},
	forward: function()
	{
		if(window.history)
			window.history.forward();
	}
};

Single.tools =
{
	stringToFunction: function(str)
	{
		var arr = str.split(".");

		var fn = (window || this);
		for (var i = 0, len = arr.length; i < len; i++) {
		fn = fn[arr[i]];
		}

		if (typeof fn !== "function") {
			throw new Error("function not found. Function: "+str);
		}
		return  fn;
	},
	cleanPath: function(str)
	{
		//make sure we have a forward slash in the start and end.
		if(str.substr(str.length-1, 1) !== "/")
			str = str+"/";

		str = str.replace(/^\s+|\s+$/g, ''); // trim
		str = str.toLowerCase();

		// remove accents, swap ñ for n, etc
		var from = "àáäâèéëêìíïîòóöôùúüûñç";
		var to   = "aaaaeeeeiiiioooouuuunc";

		for (var i=0, l=from.length ; i<l ; i++)
		{
			str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
		}

		str = str.replace(/[^a-z0-9-\/ -\/ _\/ +]/g, ''); // remove invalid chars
		str = str.replace(/\s+/g, '+'); // collapse whitespace and replace by -
		str = str.replace(/-+/g, '+'); // collapse dashes

		return str;
	}
};

Single.tracker =
{
	init: function()
	{
		//GA implementation should be done after googles guidelines -->
		//https://developers.google.com/analytics/devguides/collection/gajs/
		Single.SIGNALS.pathChange.add(this.onPathChange, this);
	},
	onPathChange: function(path)
	{
		this.track(path);
	},
	track: function(path)
	{
		if(Single.debug.enabled)
			log("pageTracker, trackPage > "+ path);
		else if(_gaq && !Single.debug.enabled)
			_gaq.push(['_trackPageview', path]);
	},
	/*
		String		category The general event category (e.g. "Videos").
		String		action The action for the event (e.g. "Play").
		String		opt_label An optional descriptor for the event.
	*/
	event: function(category, action, opt_label)
	{
		if(Single.debug.enabled)
			log("pageTracker, trackEvent > "+ category+" : "+ action +" : "+ opt_label);
		else if(_gaq && Single.debug.enabled)
			_gaq.push(['_trackEvent', category, action, opt_label]);
	}
};

/***
 *    .______      ___   .___________. __    __  .__   __.   ______    _______   _______
 *    |   _  \    /   \  |           ||  |  |  | |  \ |  |  /  __  \  |       \ |   ____|
 *    |  |_)  |  /  ^  \ `---|  |----`|  |__|  | |   \|  | |  |  |  | |  .--.  ||  |__
 *    |   ___/  /  /_\  \    |  |     |   __   | |  . `  | |  |  |  | |  |  |  ||   __|
 *    |  |     /  _____  \   |  |     |  |  |  | |  |\   | |  `--'  | |  '--'  ||  |____
 *    | _|    /__/     \__\  |__|     |__|  |__| |__| \__|  \______/  |_______/ |_______|
 */

var PathNode = Class.extend({

	id: "",
	dataId: "",// reference to the page ID.
	path: "", // same as id but with blank spaces removed
	fullPath: "",
	data: null,
	parent: null, // other PathNode
	pageData: null, // data of the page
	title: "",
	type: "",
	childNodes: [], // gets dedined in the model

	overlay: false,
	nested: false,

	isRootNode: false,
	
	prevNode: null, // usefull reference to the previous node in line (if there is one)
	nextNode: null, // usefull reference to the next node in line (if there is one)

	/**
		* @param {Object} data
		* @param {String} trailingPath
		* @param {PathNode} parentNode
		* @param {uint} index
		* @param {Boolean} isRootNode
	*/
	init: function(data, trailingPath, parentNode, model, index, isRootNode)
	{
		this.isRootNode = isRootNode;
		this.model = model;
		this.index = index;
		this.title = data.title;

		this.id = data.id === undefined || data.id === "" ? model.getUniqueId() : data.id;
		
		this.dataId = data.dataId;
		this.pageData = Single.core.pages.getPageData(this);
		this.data = data;

		//path handeling.
		trailingPath = this.createPaths(trailingPath);

		//link to parent.
		this.parent = parentNode;

		this.overlay = data.overlay === "true";
		this.nested = data.nested === "true";

		if(this.nested && this.overlay)
			throw new Error("Choose your weapon, overlay or nested and not both. path in trouble: "+ this.fullPath);
		
		//set type.
		//this.setType(this.data.type);

		//update trailingPath

		//make sure we dont save to much data? is it smart to create a new ibject for this, as the old object is saved in memory ..?
		//else just do -> this.pageData = data;
		// var newObject = jQuery.extend({}, data);
		// if(newObject.data)
		// 	delete newObject.data;
		// this.pageData = newObject;
		

		// log("PathNode: id:", this.id);
		// log("PathNode: type:", this.type);
		// log("PathNode: path:", this.path);
		// log("PathNode: fullPath:", this.fullPath);
		// log("PathNode: trailingPath:", trailingPath);
		// if(parentNode) log("	PathNode: parentNode path:", parentNode.fullPath);
		// if(parentNode) log("	PathNode: parentNode type:", parentNode.type);
		// log("---------------------");
	},
	/**
		DOC: returns if this node is a subling of parameter defined node?
		* @param {PathNode} siblingOf
		* @returns {Boolean}
	*/
	isSiblingOf: function(siblingOf)
	{
		if(!this.parent) return false;

		var p = this.parent;
		while(p)
		{
			if(siblingOf === p)
				return true;

			p = p.parent;
		}

		return false;
	},
	createPaths: function(trailingPath)
	{
		this.path = this._isRootNode ? String(this.data.path) : trailingPath + String(this.data.path);

		var splt = this.path.split("/");
		if(splt[splt.length-1] !== undefined)
			this.path = splt[splt.length-1];

		this.path = Single.tools.cleanPath(this.path);

		if(!this._isRootNode)
		{
			trailingPath += this.path;
			if(trailingPath.substr(trailingPath.length-1) !== "/")
				trailingPath += "/";
		}

		this.fullPath = trailingPath;

		return this.fullPath;
	},
	setNextAndPreviousNode: function(prev, next)
	{
		this.nextNode = next;
		this.prevNode = prev;
	},
	doesContain: function(subNode)
	{
		//does this contain sub node?
		return subNode.fullPath.indexOf(this.fullPath) !== -1;
	},
	requestNodeLaunch: function()
	{
		// log("requestNodeLaunch:", this.fullPath);
		Single.core.pathModel.set(this.name, this.fullPath);
	}
});
















