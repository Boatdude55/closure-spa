/**
 * @fileoverview
 *
 * Page 2
 */

goog.provide('app.PageTwo');

goog.require('app.lib.structor.Structor');

/**
 * [PageTwo description]
 *
 * @constructor
 * @param {string=} opt_name [description]
 * @extends {app.lib.structor.Structor}
 */
app.PageTwo = function (opt_name) {
	app.PageTwo.base(this, 'constructor', opt_name ? opt_name : "Page2");
};
goog.inherits(app.PageTwo, app.lib.structor.Structor);