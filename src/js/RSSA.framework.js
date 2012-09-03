	/*  ___
  _/ ..\
 ( \  0/___
  \    \___)
  /     \
 /      _\
`"""""`` author: felix nielsen - felix . nielsen [ a ] rwatgg . dk */
RSSA = {};

RSSA = {
	PAGE_TYPES: [],
	SIGNALS: {
		newPage: new signals.Signal(), //new page requested signal
		pageControlReady: new signals.Signal(), //when the data has been loaded
		pathSameSame: new signals.Signal() // if path is the same, signals gets fired.
	},

	initOptions: null,
	//options
		//enabledDebug (default: false) - true/false.
		//
	init: function(options, data)
	{
		this.pages.init(data.pages);
		this.paths.setup(data.sitetree);
		if(options.enabledDebug)
		{
			RSSA.debug.init(this.paths.rootNode);
		}
	},

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
	pages:
	{
		previousNode: null, /* keep a memory of the previous node, good for animation references. */
		currentNode: null, /*PathNode*/
		currentPage: null,
		_pagesData: null,

		init: function(pages)
		{
			this._pagesData = [];
			for (var i = 0; i < pages.length; i++) {
				this._pagesData[pages[i].id] = pages[i];
			}
		},
		requestNewPage: function(path)
		{
			//request a new page from a specific path, used for when you don't have a reference to a node.
			var node = RSSA.paths.getNode(path);
			node.requestNodeLaunch();
		},
		onNewPageRequested: function(path)
		{
			this.removeOldPage();

			this.currentNode = RSSA.paths.getNode(path);
			
			log("pageControl > onNewPageRequested:", path, this.currentNode);

			// this.currentNode.page = this.currentPage;
			RSSA.SIGNALS.newPage.dispatch(this.currentNode, this.previousNode);

			var data = this.getPageData(this.currentNode.id);
			var _class = RSSA.tools.stringToFunction(data.page);
			this.currentPage = new _class(this.currentNode);
			
			this.currentPage.start();
		},
		getPageData: function(id)
		{
			return this._pagesData[id];
		},
		removeOldPage: function()
		{
			if(this.currentNode)
			{
				this.previousNode = this.currentNode;
				this.currentNode.page = null;
			}

			if(this.currentPage)
				this.currentPage.remove();

			this.currentPage = null;
			// log("pageControl > remove old page");
		}
	},

	/***
 *    .______      ___   .___________. __    __  .___  ___.   ______    _______   _______  __
 *    |   _  \    /   \  |           ||  |  |  | |   \/   |  /  __  \  |       \ |   ____||  |
 *    |  |_)  |  /  ^  \ `---|  |----`|  |__|  | |  \  /  | |  |  |  | |  .--.  ||  |__   |  |
 *    |   ___/  /  /_\  \    |  |     |   __   | |  |\/|  | |  |  |  | |  |  |  ||   __|  |  |
 *    |  |     /  _____  \   |  |     |  |  |  | |  |  |  | |  `--'  | |  '--'  ||  |____ |  `----.
 *    | _|    /__/     \__\  |__|     |__|  |__| |__|  |__|  \______/  |_______/ |_______||_______|
 */
//Controls the path of the application. Uses Path.js to handle crossbrowser issues.
	paths: {
		//consts
		DEBUG_MODE: false, //ligesom jeppes UX framework.

		//vars
		currentPath: "",

		data: null,
		nodes: null,
		rootNode: null,

		randomId: 666,

		DEFAULT_TITLE: "<insert random title>",

		init: function(markupContainer)
		{
			this.nodes = [];

			this.loadSiteTree(SITE_TREE_URL);
		},
		setup: function(data)
		{
			this.data = data;
			this.nodes = [];

			//map nodes
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

			if(isRootNode)
			{
				this.rootNode = pathNode;
				//map root node.
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
						this.mapNextAndPreviousOnChildnodes(pathNode.childNodes);
					}
				}
			}

			return ary;
		},
		mapNextAndPreviousOnChildnodes: function(childNodes)
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
				RSSA.SIGNALS.pathSameSame.dispatch(pages.currentNode);
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
		onPathChange: function(currentPath)
		{
			this.currentPath = currentPath;

			this.currentPathNoHash = currentPath.split("#").join("");
			
			RSSA.pages.onNewPageRequested(this.currentPathNoHash);

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
		getCurrentNode: function()
		{
			return this.getNode(this.currentPath);
		}
	},

	tools:
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
	}

},



/***
 *    .______      ___   .___________. __    __  .__   __.   ______    _______   _______
 *    |   _  \    /   \  |           ||  |  |  | |  \ |  |  /  __  \  |       \ |   ____|
 *    |  |_)  |  /  ^  \ `---|  |----`|  |__|  | |   \|  | |  |  |  | |  .--.  ||  |__
 *    |   ___/  /  /_\  \    |  |     |   __   | |  . `  | |  |  |  | |  |  |  ||   __|
 *    |  |     /  _____  \   |  |     |  |  |  | |  |\   | |  `--'  | |  '--'  ||  |____
 *    | _|    /__/     \__\  |__|     |__|  |__| |__| \__|  \______/  |_______/ |_______|
 */
PathNode = Class.extend({

	id: "",
	path: "", /*Same as id but with blank spaces removed*/
	fullPath: "",
	data: null,
	parent: null, /*other PathNode*/
	title: "",
	type: "",
	childNodes: [], /* gets dedined in the model */

	_isRooNode: false,
	
	prevNode: null, /* usefull reference to the previous node in line (if there is one) */
	nextNode: null, /* usefull reference to the next node in line (if there is one) */

	init: function(data, trailingPath, parentNode, model, index, rootNode)
	{
		log("-->", data.id);
		this._isRooNode = rootNode;
		this.model = model;
		this.index = index;
		this.title = data.title;
		this.id = data.id === undefined ? model.getUniqueId() : data.id;
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

		str = str.replace(/[^a-z0-9-\/ -]/g, '') // remove invalid chars
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
















