ReadySetSingleApplication
=========================

A simple framework for single page applications.

The framework relies on certain DATA-Object structure, which can be created via a JSON file or via JS {} (Object).

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

Check out the examples for a complete Object structure reference.

<br><br>

# Examples:
* [Gallery example](http://rwatgg.dk/labs/rssa/gallery.php)
Uses Nested pages and the [Mustache](https://github.com/janl/mustache.js) framework for easy implementation.


# Todo:
* add pages dynamicly via JS, and not just via DATA-Object.
* make some good practice examples.
* a pageless implementation (check if pages in the DATA-Object is present)


# Features:
* title, include fallback title or/and set title in the DATA-Object
* Classes with a namespace structure (ex.: com.xxx.views.ContactPage).
* Overlay pages (see explanation)
* Nested pages (see explanation)
* is sibling of method, way to check if a node-a is a child of node-b
* next/forward (history)
* Uses a forked version of [Path.js](https://github.com/mtrpcic/pathjs) to handle hashtags/history.

# Auto features:
* automatically inits rootNode if no deeplink is choosen.


# Libraries
* Using [Signals](http://millermedeiros.github.com/js-signals/) as an event framework.
* Using a forked version of [Path.js](https://github.com/mtrpcic/pathjs) for path management.

# Thanks to

- Inspired by the work of Josef Kjærgaard and his amazing Flash framework.