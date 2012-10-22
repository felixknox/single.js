json-to-website
=========================

A simple framework for single page applications/websites.

## Installation

* Download: [zip](https://github.com/flexmotion/json-to-website/zipball/master)
* Git: `git clone https://github.com/flexmotion/json-to-website.git`

## JSON

The framework relies on certain DATA-Object structure, which can be created via a JS {} (Object) or by loading in an JSON file.

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
Contains the structure of the actual site (the name says it all).

#### mandatory Fields:
* `path` : String
 * Relative path name of the element, ex. "work", "about", "contact" etc.

#### optional parameters:
* `id` : String
 * Used for uniquly seperating the elements - <i>will get created if not defined</i>
* `dataId` : String
 * Reference to an element in pages - if not defined a page change event will be dispatched, but no page manipulation will get handled. Can be used for slideshow deeplinking, where the parent page is the slideshow.
* `title` : String
 * Will fall back to the default title
* `nested` : Boolean
 * If a page is set to nested, the page is reliant on it's parent, and will force parent to open before itself (if parent is not open).
* `overlay` : Boolean
 * If a page is set to overlay, it keeps the current page open and opens the page on top of it (if no current page, rootNode will be opened).

OBS. if an element is both defined as nested and overlay, an error will be thrown.

<br>

### pages (JSON):
Contains each individual page's data.
#### mandatory fields:
* `dataId` : String
 * Reference id to an element in sitetree
* `page` : String
 * Reference to a page type created by extending JW.default.BasicPage<br><i>support for namespace structure </i>ex. `GalleryExample.pages.GalleryImage`

#### optional parameters:
* Add fields that your page requires. Parameters will be accesable on a Class level via `this.dataNode`

Check out the examples for a complete Object structure reference.

<br><br>

## Examples:
* [Gallery example](http://rwatgg.dk/labs/jw/gallery.php)
Uses Nested pages and the [Mustache](https://github.com/janl/mustache.js) templating framework for easy implementation.
 <i>Debug-menu is on the left</i>


## Todo:
* add pages dynamicly via JS, and not just via DATA-Object.
* make a couple more good practice examples.
* parameters, possibility to add querystring like parameters: /gallery?page=2&sort=alphabetic
* test in older browsers/mobile.
* make a debug view for mobile devices.
* make an own path implementation, exlude Path.js.


## Features:
* title, include fallback title or/and set title in the DATA-Object
* Classes with a namespace structure (ex.: com.xxx.views.ContactPage).
* [Overlay](#optional-parameters) pages
* [Nested](#optional-parameters) pages
* is sibling of method, way to check if a node-a is a child of node-b
* next/forward (history)
* Uses a forked version of [Path.js](https://github.com/mtrpcic/pathjs) to handle hashtags/history.

## Auto features:
* automatically inits rootNode if no deeplink is choosen.

# Libraries
* Using [Signals](http://millermedeiros.github.com/js-signals/) as an event framework.
* Using a forked version of [Path.js](https://github.com/mtrpcic/pathjs) for path management.

# Thanks to
- Inspired by the work of Josef Kjærgaard and his awesome sauce Flash framework.