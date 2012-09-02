$(window).ready(function()
{
	$.getJSON("assets/json/data.json", bind(window, window.onLoaded));
});

function onLoaded(data)
{
	RSSA.init({enabledDebug: true}, data);

	my = {};
	my.namespaced = {};
	(my.namespaced.MyClass = function() {
		console.log("constructed");
	}).prototype = {
		doho: function() {
			console.log("doing");
		}
	};

	var MyClass = RSSA.tools.stringToFunction("my.namespaced.MyClass");
	var instance = new MyClass();
	instance.doho();
}