/**
 * @fileoverview
 *
 * TopBar for the Application
 */
goog.provide('app.structor.TopBar');

goog.require('goog.ui.Container');
goog.require('app.structor.TopBarRenderer');

goog.require('app.structor.TopBarHeader');
goog.require('app.structor.TopBarItem');

/**
 * [TopBar description]
 * @constructor
 * @param {goog.ui.ContainerRenderer=} opt_renderer Renderer used to render or
 *     decorate the menu bar; defaults to {@link goog.ui.MenuBarRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *     interaction.
 * @extends {goog.ui.Container}
 */
app.structor.TopBar = function (opt_renderer, opt_domHelper) {
	app.structor.TopBar.base(this, 'constructor',
		null,
		opt_renderer ? opt_renderer : app.structor.TopBarRenderer.getInstance(),
		opt_domHelper);
	this.addItem(new app.structor.TopBarHeader("Header"));
	this.addItem(new app.structor.TopBarItem("Page 1", {
		route: "page1",
		structor: "page1"
	}));
	this.addItem(new app.structor.TopBarItem("Page 2", {
		route: "page2",
		structor: "page2"
	}));
	this.addItem(new app.structor.TopBarItem("Page 3", {
		route: "page3",
		structor: "page3"
	}));
	this.addItem(new app.structor.TopBarItem("Page 4", {
		route: "page4",
		structor: "page4"
	}));
};
goog.inherits(app.structor.TopBar, goog.ui.Container);

/**
 * Adds a new menu item at the end of the menu.
 * @param {app.structor.TopBarHeader|app.structor.TopBarItem} item Menu
 *     item to add to the menu.
 * @deprecated Use {@link #addChild} instead, with true for the second argument.
 */
app.structor.TopBar.prototype.addItem = function(item) {
  this.addChild(item, true);
};


/**
 * Adds a new menu item at a specific index in the menu.
 * @param {app.structor.TopBarHeader|app.structor.TopBarItem} item Menu
 *     item to add to the menu.
 * @param {number} n Index at which to insert the menu item.
 * @deprecated Use {@link #addChildAt} instead, with true for the third
 *     argument.
 */
app.structor.TopBar.prototype.addItemAt = function(item, n) {
  this.addChildAt(item, n, true);
};