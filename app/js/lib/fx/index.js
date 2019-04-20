/**
 * @fileoverview Animation extensions to native google closure animation clasees
 * Adds getters / setters goog.fx.Animation
 */

goog.provide('app.lib.fx.Animation');

goog.require('goog.fx.Animation');

/**
 * Constructor for an animation object.
 * @param {Array.<number>} start Array for start coordinates.
 * @param {Array.<number>} end Array for end coordinates.
 * @param {number} duration Length of animation in milliseconds.
 * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @constructor
 * @extends {goog.fx.Animation}
 */
app.lib.fx.Animation = function(start, end, duration, opt_acc)
{
    goog.base(this, start, end, duration, opt_acc);
};

goog.inherits(app.lib.fx.Animation, goog.fx.Animation);



/**
 * Returns animation end point
 *
 * @return  {Array.<number>}
 */
app.lib.fx.Animation.prototype.getEndPoint = function()
{
    return this.endPoint;
};

/**
 * Returns animation duration
 *
 * @return  {number}
 */
app.lib.fx.Animation.prototype.getDuration = function()
{
    return this.duration;
};

/**
 * Returns animation start point
 *
 * @return  {Array.<number>}
 */
app.lib.fx.Animation.prototype.getStartPoint = function()
{
    return this.startPoint;
};

/**
 * Sets animation duration
 *
 * @param  {number} duration
 */
app.lib.fx.Animation.prototype.setDuration = function(duration)
{
    this.duration = duration;
};

/**
 * Sets animation end point
 *
 * @param  {Array.<number>} endPoint
 * @return {app.lib.fx.Animation}
 */
app.lib.fx.Animation.prototype.setEndPoint = function(endPoint)
{
    this.endPoint = endPoint;
    return this;
};

/**
 * Sets animation start point
 *
 * @param  {Array.<number>} startPoint
 * @return {app.lib.fx.Animation}
 */
app.lib.fx.Animation.prototype.setStartPoint = function(startPoint)
{
    this.startPoint = startPoint;
    return this;
};