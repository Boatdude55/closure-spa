/**
 * @fileoverview Renderer for {@link goog.ui.menuBar}.
 *
 */

goog.provide('app.structor.TopBarRenderer');

goog.require('goog.a11y.aria.Role');
goog.require('goog.ui.Container');
goog.require('goog.ui.ContainerRenderer');



/**
 * Default renderer for {@link goog.ui.menuBar}s, based on {@link
 * goog.ui.ContainerRenderer}.
 * @constructor
 * @extends {goog.ui.ContainerRenderer}
 * @final
 */
app.structor.TopBarRenderer = function() {
  app.structor.TopBarRenderer.base(
      this, 'constructor', goog.a11y.aria.Role.MENUBAR);
};
goog.inherits(app.structor.TopBarRenderer, goog.ui.ContainerRenderer);
goog.addSingletonGetter(app.structor.TopBarRenderer);


/**
 * Default CSS class to be applied to the root element of elements rendered
 * by this renderer.
 * @type {string}
 */
app.structor.TopBarRenderer.CSS_CLASS = goog.getCssName('ui-structor-topbar');


/**
 * @override
 */
app.structor.TopBarRenderer.prototype.getCssClass = function() {
  return app.structor.TopBarRenderer.CSS_CLASS;
};


/**
 * Returns the default orientation of containers rendered or decorated by this
 * renderer.  This implementation returns `HORIZONTAL`.
 * @return {goog.ui.Container.Orientation} Default orientation for containers
 *     created or decorated by this renderer.
 * @override
 */
app.structor.TopBarRenderer.prototype.getDefaultOrientation = function() {
  return goog.ui.Container.Orientation.HORIZONTAL;
};