/**
 * @fileoverview A class for representing menu headers.
 * @see app.structor.TopBar
 *
 */

goog.provide('app.structor.TopBarHeader');

goog.require('goog.ui.Component');
goog.require('goog.ui.Control');
goog.require('app.structor.TopBarHeaderRenderer');
goog.require('goog.ui.registry');



/**
 * Class representing a topbar header.
 * @param {goog.ui.ControlContent} content Text caption or DOM structure to
 *     display as the content of the item (use to add icons or styling to
 *     menus).
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper used for
 *     document interactions.
 * @param {app.structor.TopBarHeaderRenderer=} opt_renderer Optional renderer.
 * @constructor
 * @extends {goog.ui.Control}
 */
app.structor.TopBarHeader = function(content, opt_domHelper, opt_renderer) {
  goog.ui.Control.call(
      this, content, opt_renderer || app.structor.TopBarHeaderRenderer.getInstance(),
      opt_domHelper);

  this.setSupportedState(goog.ui.Component.State.DISABLED, false);
  this.setSupportedState(goog.ui.Component.State.HOVER, false);
  this.setSupportedState(goog.ui.Component.State.ACTIVE, false);
  this.setSupportedState(goog.ui.Component.State.FOCUSED, false);

  // Headers are always considered disabled.
  this.setStateInternal(goog.ui.Component.State.DISABLED);
};
goog.inherits(app.structor.TopBarHeader, goog.ui.Control);


// Register a decorator factory function for app.structor.TopBarHeaders.
goog.ui.registry.setDecoratorByClassName(
    app.structor.TopBarHeaderRenderer.CSS_CLASS, function() {
      // MenuHeader defaults to using MenuHeaderRenderer.
      return new app.structor.TopBarHeader(null);
    });