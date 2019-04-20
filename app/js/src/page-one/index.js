/**
 * @fileoverview
 *
 * Page 1
 */

goog.provide('app.PageOne');

goog.require('app.lib.structor.Structor');

/**
 * [PageOne description]
 *
 * @constructor
 * @param {string=} opt_name [description]
 * @extends {app.lib.structor.Structor}
 */
app.PageOne = function (opt_name) {
	app.PageOne.base(this, 'constructor', opt_name ? opt_name : "Page1");
};
goog.inherits(app.PageOne, app.lib.structor.Structor);