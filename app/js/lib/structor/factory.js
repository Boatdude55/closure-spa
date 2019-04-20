/**
 * @fileoverview
 * Structor factory
 */
goog.provide('app.lib.structor.Factory');

goog.require('goog.structs.Map');
goog.require('app.lib.structor.Structor');

/**
 * @constructor
 */
app.lib.structor.Factory = function () {

  /**
   * Structor factory mapping.
   *
   * @type {goog.structs.Map}
   * @private
   */
  this.factory_ = new goog.structs.Map();

};
goog.addSingletonGetter(app.lib.structor.Factory);

/**
 * @param  {string} name Name of the structor
 * @return {app.lib.structor.Structor}
 */
app.lib.structor.Factory.prototype.getStructor = function (name) {
  
  var factory = this.factory_.get(name);

  return factory ? new factory() : null;

};

/**
 * @param  {string} name
 * @param  {function(new:app.lib.structor.Structor, string=)} structor
 */
app.lib.structor.Factory.prototype.register = function (name, structor) {
  
  this.factory_.set(name, structor);
  
  return this;

};