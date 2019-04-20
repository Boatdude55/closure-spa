/**
 * @fileoverview
 *
 * Structor Factory for main module
 */

goog.provide('app.StructorFactory');

goog.require('app.lib.structor.Factory');
goog.require('app.PageOne');
goog.require('app.PageTwo');
goog.require('app.PageThree');
goog.require('app.PageFour');

/**
 * [StructorFactory description]
 *
 * @constructor
 * @extends {app.lib.structor.Factory}
 */
app.StructorFactory = function () {
	app.StructorFactory.base(this, 'constructor');
	this.register('page1', app.PageOne);
	this.register('page2', app.PageTwo);
	this.register('page3', app.PageThree);
	this.register('page4', app.PageFour);
};
goog.inherits(app.StructorFactory, app.lib.structor.Factory);
goog.addSingletonGetter(app.StructorFactory);