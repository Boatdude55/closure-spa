/**
 * @fileoverview
 *
 * Window scrolling animation
 */
goog.provide('app.lib.fx.WindowScroll');

goog.require('app.lib.fx.dom.PredefinedEffect');


/**
 * Creates an animation object that will scroll an element from A to B.
 *
 * Start and End should be 2 dimensional arrays
 *
 * @param {Element|Window} element Dom Node to be used in the animation.
 * @param {Array.<number>} start 2D array for start scroll left and top.
 * @param {Array.<number>} end 2D array for end scroll left and top.
 * @param {number} time Length of animation in milliseconds.
 * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {app.lib.fx.dom.PredefinedEffect}
 * @constructor
 */
app.lib.fx.WindowScroll = function(element, start, end, time, opt_acc) {
    if (start.length != 2 || end.length != 2)
    {
        throw Error('Start and end points must be 2D');
    }
    app.lib.fx.dom.PredefinedEffect.apply(this, arguments);
};
goog.inherits(app.lib.fx.WindowScroll, app.lib.fx.dom.PredefinedEffect);


/**
 * Animation event handler that will set the scroll posiiton of an element
 * @protected
 * @override
 */
app.lib.fx.WindowScroll.prototype.updateStyle = function() {
    window.scrollTo(this.coords[0], this.coords[1]);
};
