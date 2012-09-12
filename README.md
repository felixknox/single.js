ReadySetSingleApplication
=========================

A ultra simple framework for single page applications - inspired by the work of Josef Kjærgaard and his incredible Flash framework.

Far from done - aiming for the 10th. of September 2012.


# Todo:
* add pages dynamicly via JS, and not just via JSON.
* make some good practice examples.
* a pageless implementation (check if pages in the JSON is present)
* make a way to disable a node from JSON, and force it to jump directly to the first child (or predefined child).


# Features:
* title, include title in the JSON
* Classes with a namespace structure.
* Overlay page, ignores the current page and just displays a page "on top".
* Nested pages, fires the page underneath, and opens that page. Opens nested page after parent page is opened (it's dependent on it's parent).
* is sibling of
* next/forward (history)

# Auto features:
* automatically inits rootNode if no deeplink is choosen.