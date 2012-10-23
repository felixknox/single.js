json-to-website
=========================

a simple UI-less framework for single page applications/websites.

## Installation

* Download: [zip](https://github.com/flexmotion/json-to-website/zipball/master)
* Git: `git clone https://github.com/flexmotion/json-to-website.git`

## JSON
the framework relies on certain DATA-Object structure, which can be created via a JS {} or by loading in an JSON file.

    {
    	sitetree
    	{
    		...
    	},
    	pages
    	{
    		...
    	}
    }

<br>

### sitetree (JSON):
contains the structure of the actual site (the name says it all)

#### mandatory Fields:
* `path` : String
 * relative path name of the element, ex. "work", "about", "contact" etc.

#### optional parameters:
* `id` : String
 * used for uniquly seperating the elements - <i>will get created if not defined</i>
* `dataId` : String
 * reference to an element in pages - if not defined a page change event will be dispatched, but no page manipulation will get handled. Can be used for slideshow deeplinking, where the parent page is the slideshow
* `title` : String
 * will fall back to the default title
* `nested` : Boolean
 * if a page is set to nested, the page is reliant on it's parent, and will force parent to open before itself (if parent is not open)
* `overlay` : Boolean
 * if a page is set to overlay, it keeps the current page open and opens the page on top of it (if no current page, rootNode will be opened)

OBS. if an element is both defined as nested and overlay, an error will be thrown.

<br>

### pages (JSON):
contains each individual page's data.
#### mandatory fields:
* `dataId` : String
 * reference id to an element in sitetree
* `page` : String
 * reference to a page type created by extending JW.default.BasicPage<br><i>support for namespace structure </i>ex. `GalleryExample.pages.GalleryImage`

#### optional parameters:
* add fields that your page requires. Parameters will be accesable on a Class level via `this.dataNode`

check out the [Examples](#examples) for a complete Object structure reference.

## Instantiation
to instantiate the framework:

	var options = {enabledDebug: true, title: "Fallback title, when node has no title", enableTracking: true};
	var dataObj = {sitetree:..., pages:...};
	var domNode = $("#site")
	JW.init(options, dataObj, domNode);

* `enableDebug`, adds the debug menu for overview and easy navigation
* `title`, a fallback title for when the [title](#optional-parameters) parameter is not set for a node
* `enableTracking`, implement google analytics on the page, and page events will automaticlly get called from the framework
 * https://developers.google.com/analytics/devguides/collection/gajs/
 * JW.tracker.event(category, action, opt_label) for custom event tracking.



## Examples:
* [Ultra simple](http://rwatgg.dk/labs/jw/examples/simple.php) only the debug menu, No UI.
* [Gallery example](http://rwatgg.dk/labs/jw/examples/gallery.php)
uses [Nested](#optional-parameters) pages and [Mustache](https://github.com/janl/mustache.js) templating framework for easy implementation
 <i>Debug-menu is on the left</i>

## Todo:
* add pages dynamicly via JS, and not just via DATA-Object
* make a couple more good practice examples
* parameters, possibility to add querystring like parameters: /gallery?page=2&sort=alphabetic
* test in older browsers/mobile.
* make a debug view for mobile devices

## Features:
* title, include fallback title or/and set title in the DATA-Object
* Classes with a namespace structure (ex.: com.xxx.views.ContactPage)
* [Overlay](#optional-parameters) pages
* [Nested](#optional-parameters) pages
* is sibling of method, way to check if a node-a is a child of node-b
* next/forward (history)
* 
<br>...

## Auto features:
* automatically inits rootNode if no subpage (deeplink) is requested

## Libraries
* using [Signals](http://millermedeiros.github.com/js-signals/) as an event framework
* using a forked version of [Path.js](https://github.com/mtrpcic/pathjs) for path management (hashtag/HTML5 History)

## Thanks to
- Inspired by the work of [Josef Kjærgaard](http://josefkjaergaard.com/) and his "awesome sauce" Flash framework.