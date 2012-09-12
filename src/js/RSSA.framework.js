	/*  ___
  _/ ..\
 ( \  0/___
  \    \___)
  /     \
 /      _\
`"""""`` author: felix nielsen - felix . nielsen [ a ] rwatgg . dk */
RSSA =
{
	PAGE_TYPES: [],
	SIGNALS:
	{
		newPage: new signals.Signal(), //new page requested signal
		pageControlReady: new signals.Signal(), //when the data has been loaded
		pathSameSame: new signals.Signal(), // if path is the same, signals gets fired.
		pageStatus: new signals.Signal() //with a value [String] of "in" or "out".
	},

	//options
		//enabledDebug (default: false) - true/false.
	initOptions: null,

	//variables
	currentNode: null,
	previousNode: null
};
	
		
//
RSSA.init = function(options, data, pageContainer)
{
	this.pages.init(data.pages, pageContainer);
	this.paths.setup(data.sitetree, options.title);

	if(options.enabledDebug)
	{
		RSSA.debug.init(this.paths.rootNode);
	}
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
RSSA.pages =
{
	currentPage: null,
	currentOverlayPage: null,
	currentNestedPage: null,

	pageContainer: null,

	_pagesData: null,

	init: function(data, container)
	{
		this.pageContainer = container;

		RSSA.SIGNALS.pageStatus.add(this.onPageStatusChange, this);
		this._pagesData = [];
		for (var i = 0; i < data.length; i++) {
			this._pagesData[data[i].dataId] = data[i];
		}
	},
	requestNewPage: function(path)
	{
		//request a new page from a specific path, used for when you don't have a reference to a node.
		var node = RSSA.paths.getNode(path);
		node.requestNodeLaunch();
	},
	onNewPageRequested: function(currentNode, path)
	{
		//var newNode = RSSA.paths.getNode(path);
		if(!currentNode.overlay && !currentNode.nested)
		{
			this.removeOldPage();
		}

		//always remove overlay page when changing page.
		this.removeOldOverlayPage();

		this.removeOldNestedPage();

		//debug.
		if(RSSA.debug.enabled) log("pageControl > onNewPageRequested:", path, currentNode);

		//build the data and class.
		var data = this.getPageData(currentNode.dataId);
		var _class = RSSA.tools.stringToFunction(data.page);

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

				data = this.getPageData(currentNode.parent.dataId);
				_class = RSSA.tools.stringToFunction(data.page);
				this.previousNode = currentNode.parent;
				this.setupPage(_class, currentNode.parent);
			}else if(this.currentPage && this.currentPage.dataNode.dataId === currentNode.parent.dataId)
			{
				//current page is parent of nested page, therefore animate nestedpage in
				this.currentNestedPage.animateIn();
			}else if(!this.currentPage)
			{
				//no current page, therefore set it up.
				data = this.getPageData(currentNode.parent.dataId);
				_class = RSSA.tools.stringToFunction(data.page);
				this.previousNode = currentNode.parent;
				this.setupPage(_class, currentNode.parent);
			}
		}else
		{
			//just setup the page.
			this.setupPage(_class, currentNode);
		}

		//set the page of the currentNode (for deepbinding reference)
		RSSA.currentNode.page = this.currentPage;

		//dispatch a signal about the new page for all the listeners.
		RSSA.SIGNALS.newPage.dispatch(RSSA.currentNode, RSSA.previousNode);
	},

	//Page setup
	setupOverlayPage: function(c, node)
	{
		this.currentOverlayPage = new c(node);
		this.currentOverlayPage.setup(this.pageContainer);
		this.currentOverlayPage.animateIn();
	},
	setupNestedPage: function(c, node)
	{
		this.currentNestedPage = new c(node);
		//only setup the nested page if there is a current page, else the nested page have to wait.
		if(this.currentPage && this.currentPage.dataNode === node.parent)
			this.currentNestedPage.setup(this.pageContainer);
	},
	setupPage: function(c, node)
	{
		this.currentPage = new c(node);
		this.currentPage.setup(this.pageContainer);
		this.currentPage.animateIn();

		//setup and animate nested page in as well.
		if(this.currentNestedPage)
		{
			this.currentNestedPage.setup(this.pageContainer);
		}
	},

	//removal of the pages.
	removeOldPage: function()
	{
		if(RSSA.currentNode)
		{
			RSSA.currentNode.page = null;
		}

		if(this.currentPage) log("this.currentPage:", this.currentPage._buildId)
		if(this.currentPage)
			this.currentPage.animateOut();

		this.currentPage = null;
	},
	removeOldOverlayPage: function()
	{
		if(RSSA.currentNode)
		{
			RSSA.currentNode.page = null;
		}

		if(this.currentOverlayPage)
			this.currentOverlayPage.animateOut();

		this.currentOverlayPage = null;
	},
	removeOldNestedPage: function()
	{
		if(this.currentNestedPage)
			this.currentNestedPage.animateOut();

		this.currentNestedPage = null;
	},
	onPageStatusChange: function(type /* "in" or "out"*/, page)
	{
		
	},
	getPageData: function(dataId)
	{
		return this._pagesData[dataId];
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
RSSA.paths =
{
	//consts
	DEBUG_MODE: false, //ligesom jeppes UX framework.

	//vars
	currentPath: "",

	data: null,
	nodes: null,
	rootNode: null,

	randomId: 666,

	DEFAULT_TITLE: "",

	setup: function(data, defaultTitle)
	{
		this.DEFAULT_TITLE = defaultTitle;
		this.data = data;
		this.nodes = [];

		//map rootNode
		this.map(this.data, this.data[0].path);

		var that = this;
		Path.rescue(function(){
			that.on404();
		});

		RSSA.SIGNALS.pageControlReady.dispatch();
		
		forceToHashtag = true;
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
		for (var i = 0; i < this.nodes.length; i++) {
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
		RSSA.paths.onPathChange(this.path);
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

		Path.map(pathNode.fullPath).to(this.bindable).enter(this.onEnter);
		if(pathNode.fullPath.length > 1 && pathNode.fullPath.substr(pathNode.fullPath.length-1, 1) !== "/")
		{
			Path.map(pathNode.fullPath+"/").to(this.bindable).enter(this.onEnter);
		}

		return pathNode;
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
		for (var i = 0; i < childNodes.length; i++) {
			next = i === childNodes.length - 1 ? childNodes[0] : childNodes[i+1];
			childNodes[i].setNextAndPreviousNode(prev, next);
			prev = childNodes[i];
		}
	},
	on404: function(params)
	{
		log("404: show 404 madness", params);
	},
	set: function(name, path)
	{
		if(pages.currentNode && pages.currentNode.fullPath === path)
		{
			// if path is the same, then it means a user has clicked an already active menu item, therefore we should reset the list.
			RSSA.SIGNALS.pathSameSame.dispatch(RSSA.currentNode);
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
		
		RSSA.previousNode = RSSA.currentNode;
		RSSA.currentNode = this.getCurrentNode();

		RSSA.pages.onNewPageRequested(RSSA.currentNode, this.currentPathNoHash);

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

RSSA.tools =
{
	stringToFunction: function(str) {
		var arr = str.split(".");

		var fn = (window || this);
		for (var i = 0, len = arr.length; i < len; i++) {
		fn = fn[arr[i]];
		}

		if (typeof fn !== "function") {
			throw new Error("function not found");
		}
		return  fn;
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
	dataId: "",//reference to the page ID.
	path: "", /*Same as id but with blank spaces removed*/
	fullPath: "",
	data: null,
	parent: null, /*other PathNode*/
	title: "",
	type: "",
	childNodes: [], /* gets dedined in the model */

	overlay: false,
	nested: false,

	_isRooNode: false,
	
	prevNode: null, /* usefull reference to the previous node in line (if there is one) */
	nextNode: null, /* usefull reference to the next node in line (if there is one) */

	init: function(data, trailingPath, parentNode, model, index, rootNode)
	{
		this._isRooNode = rootNode;
		this.model = model;
		this.index = index;
		this.title = data.title;
		this.overlay = data.overlay === "true";
		if(!this.overlay && data.nested === "true")
			this.nested = true;

		this.id = data.id === undefined || data.id === "" ? model.getUniqueId() : data.id;
		
		this.dataId = data.dataId;
		this.data = data;

		//path handeling.
		trailingPath = this.createPaths(trailingPath);

		//link to parent.
		this.parent = parentNode;
		
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
	//DOC: returns if this node is a subling of parameter defined node?
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
		this.path = this._isRooNode ? String(this.data.path) : trailingPath + String(this.data.path);

		var splt = this.path.split("/");
		if(splt[splt.length-1] !== undefined)
			this.path = splt[splt.length-1];

		this.path = this.cleanPath(this.path);

		if(!this._isRooNode)
		{
			trailingPath += this.path;
			if(trailingPath.substr(trailingPath.length-1) !== "/")
				trailingPath += "/";
		}

		this.fullPath = trailingPath;

		return this.fullPath;
	},
	cleanPath: function(str)
	{
		str = str.replace(/^\s+|\s+$/g, ''); // trim
		str = str.toLowerCase();

		// remove accents, swap ñ for n, etc
		var from = "àáäâèéëêìíïîòóöôùúüûñç";
		var to   = "aaaaeeeeiiiioooouuuunc";

		for (var i=0, l=from.length ; i<l ; i++) {
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
		}

		str = str.replace(/[^a-z0-9-\/ -\/ _\/ +]/g, '') // remove invalid chars
		.replace(/\s+/g, '-') // collapse whitespace and replace by -
		.replace(/-+/g, '-'); // collapse dashes

		return str;
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
		RSSA.paths.set(this.name, this.fullPath);
	}
});
















