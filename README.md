ReadySetSingleApplication
=========================

A simple framework for single page applications.

The Framework relies on certain Object structure.

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

"<strong>sitetree</strong>" contains the structure of the actual site (the name says it all).

"<strong>pages</strong>" contains the individual pages data.

<br>

# sitetree:
<strong>Mandatory:</strong><br>
* path (String)
 * path name of the element, ex. "work", "about", "contact" etc.

<strong>optional parameters:</strong><br>
* id (String)
 * Used for uniquly seperating the elements - will get created if not defined
* dataId (String)
 * Reference to an element in pages - if not defined a page change event will get called, but no page manipulation will get handled. Can be used for slideshow deeplinking, where the parent page is the slideshow.
* title (String)
 * Will fall back to the default title
* nested (Boolean)
 * If a page is set to nested, the page is reliant on it's parent, and will force parent to open before itself (if parent is not open).
* overlay (Boolean)
 * If a page is set to overlay, it keeps the current page open and opens the page on top of it (if no current page, rootNode will be opened).

OBS. if an element is both defined as nested and overlay, an error will be thrown.

<br>

# pages:
<strong>Mandatory:</strong><br>
* dataId (String)
 * Reference id to an element in sitetree
* page (String)
 * Reference to a page type created by extending RSSA.default.BasicPage - support for namespace structure ex. GalleryExample.pages.GalleryImage

<strong>optional parameters:</strong><br>
* Add fields that your page requires.

Check out the examples for a complete JSON structure reference.

<br><br>

RSSA.init --><br>
Option: element<br>
enabledDebug: true<br>
title: "Title when node has no Title"<br>
enableTracking: true


[Link to examples](http://rwatgg.dk/labs/rssa).
* [Using Mustache](https://github.com/janl/mustache.js)


# Todo:
* add pages dynamicly via JS, and not just via JSON.
* make some good practice examples.
* a pageless implementation (check if pages in the JSON is present)


# Features:
* title, include title in the JSON
* Classes with a namespace structure.
* Overlay page, ignores the current page and just displays a page "on top".
* Nested pages, fires the page underneath, and opens that page. Opens nested page after parent page is opened (it's dependent on it's parent).
* is sibling of
* next/forward (history)

# Auto features:
* automatically inits rootNode if no deeplink is choosen.


# Libraries
* Using [Signals](http://millermedeiros.github.com/js-signals/) as an event framework.
* Using a forked version of [Path.js](https://github.com/mtrpcic/pathjs) for path management.

# Thanks

- Inspired by the work of Josef Kjærgaard and his amazing Flash framework.