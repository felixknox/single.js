// the top menu. Illustrating how to build a multi level dropdown menu from the sitetree structure of the JSON file using the Bootstrap dropdown component.
var SimpleExampleMenu = {
	nav: null,
	init: function()
	{
		// append
		$("#site").append(''+
		'<div class="navbar navbar-fixed-top">'+
			'<div class="navbar-inner">'+
				'<div class="container-fluid">'+
					'<div class="nav-collapse">'+
						'<ul class="nav">'+
							'<li class="dropdown">'+
								'<a data-toggle="dropdown" class="dropdown-toggle" href="#"><b>Site menu (from JSON)</b> <b class="caret"></b></a>'+
							'</li>'+
						'</ul>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>');

		this.nav = $("#site .navbar .nav .dropdown");

		var rootNode = Single.core.pathModel.rootNode;
		this.createMenuLevel(rootNode.id, rootNode.childNodes, this.nav);

		// init bootstrap jQuery module
		$('.dropdown-toggle').dropdown();

		// connect the menu nodes with the Single framework.
		this.connectMenuNodesWithFramework();
	},
	createMenuLevel: function(id, nodes, container)
	{
		var currentNav = $(container).append('<ul id="'+id+'" class="dropdown-menu"></ul>').find("ul#"+id), that = this;
		$(nodes).each(function(i, el)
		{
			if(el.childNodes && el.childNodes.length > 0)
			{
				currentNav.append('<li class="dropdown-submenu"><a data-url="'+el.fullPath+'" href="#">'+el.fullPath+'</a><ul id="'+el.id+'" class="dropdown-menu"></ul></li>');
				that.createMenuLevel(el.id, el.childNodes, currentNav);
			}else
			{
				currentNav.append('<li><a data-url="'+el.fullPath+'" id="'+el.id+'" href="#">'+el.fullPath+'</a></li>');
			}
		});
	},
	connectMenuNodesWithFramework: function()
	{
		this.nav.find("a:not(.dropdown-toggle)").each(function(i, el)
		{
			$(el).click(function(event)
			{
				event.preventDefault();
				var linkNode = Single.core.pathModel.getNode($(this).attr("data-url"));
				// requestNodeLaunch is a method that changes the URL, updated the pages and signals the system.
				linkNode.requestNodeLaunch();
			});
		});
	}
};