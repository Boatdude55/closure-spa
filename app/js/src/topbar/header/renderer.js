/**
 * @fileoverview Renderer for {@link app.structor.TopBarHeader}s.
 *
 */

goog.provide('app.structor.TopBarHeaderRenderer');

goog.require('goog.ui.ControlRenderer');



/**
 * Renderer for menu headers.
 * @constructor
 * @extends {goog.ui.ControlRenderer}
 */
app.structor.TopBarHeaderRenderer = function() {
  goog.ui.ControlRenderer.call(this);
};
goog.inherits(app.structor.TopBarHeaderRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(app.structor.TopBarHeaderRenderer);


/**
 * Default CSS class to be applied to the root element of components rendered
 * by this renderer.
 * @type {string}
 */
app.structor.TopBarHeaderRenderer.CSS_CLASS = goog.getCssName('ui-structor-topbar-header');


/**
 * Returns the CSS class to be applied to the root element of components
 * rendered using this renderer.
 * @return {string} Renderer-specific CSS class.
 * @override
 */
app.structor.TopBarHeaderRenderer.prototype.getCssClass = function() {
  return app.structor.TopBarHeaderRenderer.CSS_CLASS;
};