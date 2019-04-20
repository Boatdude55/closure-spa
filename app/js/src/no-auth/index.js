/**
 * @fileoverview
 *
 * Page 4
 */

goog.provide('app.NoAuth');

goog.require('app.lib.structor.Structor');

/**
 * [NoAuth description]
 *
 * @constructor
 * @param {string=} opt_name [description]
 * @extends {app.lib.structor.Structor}
 */
app.NoAuth = function (opt_name) {
	app.NoAuth.base(this, 'constructor', opt_name ? opt_name : "No Auth");
};
goog.inherits(app.NoAuth, app.lib.structor.Structor);