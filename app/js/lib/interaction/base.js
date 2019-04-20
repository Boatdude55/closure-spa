/**
 * @fileoverview
 *
 * Base Class for Interaction
 */

goog.provide('app.lib.interaction.Interaction');

goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');

/**
 * [Interaction description]
 * @constructor
 * @extends {goog.events.EventTarget}
 */
app.lib.interaction.Interaction = function () {
  app.lib.interaction.Interaction.base(this, 'constructor');

  /**
   * Event Handler
   *
   * @type {goog.events.EventHandler}
   * @private
   */
  this.handler_ = new goog.events.EventHandler(this);

};
goog.inherits(app.lib.interaction.Interaction, goog.events.EventTarget);

/** @inheritDoc */
app.lib.interaction.Interaction.prototype.disposeInternal = function () {
  goog.base(this, 'disposeInternal');
  goog.dispose(this.handler_);
};

/**
 * Initializes controller
 *
 * @param {Object} config
 * @return {Object|undefined}
 */
app.lib.interaction.Interaction.prototype.initialize = function (config) {

};

/**
 * Returns the Event handler for this controller
 *
 * @return {goog.events.EventHandler}
 */
app.lib.interaction.Interaction.prototype.getHandler = function () {
  return this.handler_;
};