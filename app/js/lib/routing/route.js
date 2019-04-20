/**
 * @fileoverview Provides a basic route for Router which matches a route with
 * exact name.
 */
goog.provide('app.lib.routing.Route');
goog.provide('app.lib.routing.Route.EventType');
goog.require('goog.events.EventTarget');
goog.require('app.lib.routing.RouteMatchEvent');

/**
 * @constructor
 * @param {string} name name of the route
 * @param {string} module
 * @extends {goog.events.EventTarget}
 */
app.lib.routing.Route = function(name, module)
{
  goog.base(this);

  /**
   * Name of the route
   *
   * @type {string}
   */
  this.name = name;

  /**
   * Name of module
   *
   * @type {string}
   */
  this.module = module;
};
goog.inherits(app.lib.routing.Route, goog.events.EventTarget);

/**
 * Checks whether route matches
 *
 * @param {string} token
 * @return {boolean}
 */
app.lib.routing.Route.prototype.match = function ( token ) {
  var matches = this.name === token;
  if (matches)
  {
    this.dispatchEvent(
      new app.lib.routing.RouteMatchEvent(
        app.lib.routing.Route.EventType.ROUTE_MATCH,
        token, this, {
          matches: matches
        }
      )
    );
    return true;
  }

  return false;
};


/**
 * @enum {string}
 */
app.lib.routing.Route.EventType = {
  ROUTE_MATCH: 'route_match'
};