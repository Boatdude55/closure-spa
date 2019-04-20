/**
 * @fileoverview
 *
 *  Abstraction of the application core which sits between the mediator and modules
 */

goog.provide("app.Interface");
goog.require("app.actions.FirebaseActions");
goog.require("app.reducers.FirebaseReducers");

/**
 * [Interface description]
 * @constructor
 * @param {app.Core} core    [description]
 * @param {string=} instanceId [description]
 * @param {Object=} options    [description]
 * @param {string=} moduleId   [description]
 */
app.Interface = function ( core, instanceId, options, moduleId ) {
	var state;
	const initialState = {
		loading: true,
		loaded: false,
		user: false
	};

	this.core = core;
	this.state = state = core.State(core.state.combineReducers({
		firebase: app.reducers.FirebaseReducers
	}), initialState);

	
	state.dispatch(app.state.BaseActions.isAuthUser(true), true);
};

/**
 * on Register a new handler for the given event.
 * @param  {string}   eventName [description]
 * @param  {Function} fn        [description]
 */
app.Interface.prototype.on = function ( eventName, fn ) {
	this.core.subscribe(eventName, fn);
};

/**
 * [onState description]
 * @param  {Function} fn [description]
 */
app.Interface.prototype.onState = function (fn) {
	this.state.subscribe(fn);
};

app.Interface.prototype.broadcast = function () {
	// this.core.publish();
};

/**
 * emit Emits an event to the socket identified by the string name. Any other parameters can be included. All serializable datastructures are supported, including Buffer
 * @param  {string}   eventName [description]
 * @param  {*=}   args      [description]
 * @param  {?Function=} cb        [description]
 */
app.Interface.prototype.emit = function ( eventName, args, cb ) {

	if ( cb == null ) {

		cb = function () {};

	}

	this.core.publish(eventName, args);

	cb();

	return;
};