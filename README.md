ReadySetSingleApplication
=========================

A simple wrapper framework for single page applications that relies on a tree structure.

the JSON relies on this structure:

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

"sitetree" contains the structure of the actual site.

"pages" contains the page data.

<br>

# sitetree:
<strong>Mandatory:</strong><br>
* path (path name of the element, ex. work)

<strong>optional parameters:</strong><br>
* id (used for uniquly seperating the elements - will get created if not defined)<br>
* dataId (reference to an element in pages - if not defined a page change event will get called, but no page manipulation will get handled. Great for slideshow deeplinking, where parent page is the slideshow)<br>
* title (will fall back to the default title)<br>
* nested (defines if a page is nested)<br>
* overlay (defines if a page is nested)<br>
* OBS. if an element is both defined as nested and overlay, an error will be thrown.

<br>

# pages:
<strong>Mandatory:</strong><br>
* dataId (reference id to an element in sitetree)<br>
* page (reference to a page type - page is optimized for a namespace structure ex. GalleryExample.pages.GalleryImage)<br>

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
* 

# Thanks

- Inspired by the work of Josef Kjærgaard and his amazing Flash framework.