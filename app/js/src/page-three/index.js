/**
 * @fileoverview
 *
 * Page 3
 */

goog.provide('app.PageThree');

goog.require('app.lib.structor.Structor');

/**
 * [PageThree description]
 *
 * @constructor
 * @param {string=} opt_name [description]
 * @extends {app.lib.structor.Structor}
 */
app.PageThree = function (opt_name) {
	app.PageThree.base(this, 'constructor', opt_name ? opt_name : "Page3");
};
goog.inherits(app.PageThree, app.lib.structor.Structor);