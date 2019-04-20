/**
 * @fileoverview Route based on matching against regular expression
 */
goog.provide('app.lib.routing.RegexRoute');
goog.require('app.lib.routing.Route');
goog.require('app.lib.routing.RouteMatchEvent');

/**
 * @constructor
 * @param {string} name Name of the route
 * @param {RegExp} regex Regular Expression to be matched against the route
 * @param {string} module name of controller assigned to the route
 * @extends {app.lib.routing.Route}
 */
app.lib.routing.RegexRoute = function(name, regex, module)
{
  goog.base(this, name, module);

  /**
   * Regex Pattern to be match against
   *
   * @type {RegExp}
   */
  this.regex = regex;
};
goog.inherits(app.lib.routing.RegexRoute, app.lib.routing.Route);

/** @inheritDoc */
app.lib.routing.RegexRoute.prototype.match = function(token)
{
  var matches = token.match(this.regex);
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