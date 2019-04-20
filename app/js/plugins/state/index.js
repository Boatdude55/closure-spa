/**
 * @fileoverview
 *
 * Plugin for Redux-like state
 */

goog.provide("app.plugins.State");

goog.require("goog.pubsub.PubSub");

app.plugins.State =  function (core, options) {

	function combineReducers (reducers) {

		var keys = goog.object.getKeys(reducers);
		var typeCheckedReducers = {};

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i]

			if ( goog.isFunction(reducers[key]) ) {
				// typeCheckedReducers[key] = reducers[key];
				goog.object.add(typeCheckedReducers, key, reducers[key]);
			}
		}

		var typeCheckedReducersKeys = goog.object.getKeys(typeCheckedReducers);


		return function (state, action) {
			state = state ? state : {};
			var hasStateChanged = false;
			var nextState = {};

			for (let i = 0; i < typeCheckedReducersKeys.length; i++) {

				const key = typeCheckedReducersKeys[i];
				const reducer = typeCheckedReducers[key];
				const previousStateForKey = state[key];
				const nextStateForKey = reducer(previousStateForKey, action);

				nextState[key] = nextStateForKey
				hasStateChanged = hasStateChanged || nextStateForKey !== previousStateForKey

			}

			return hasStateChanged ? nextState : state;
		};

	}

	function State ( opt_reducers, opt_initialState ) {

		var reducers = opt_reducers ? opt_reducers : {};
		var state = opt_initialState ? reduce(opt_initialState, {}) : reduce({}, {});
		var topic = 'ON_DATA';
		var Observer = new goog.pubsub.PubSub(true);

		/**
		 * getState description
		 * @return {Object} [description]
		 */
		function getState () {

			return state;

		};

		/**
		 * reduce description
		 * @param  {Object} state  The current state
		 * @param  {Object} action The action to change state
		 * @return {Object}        The new state
		 */
		function reduce ( state, action ) {

			var newState = {};

			if ( goog.DEBUG ) {
				console.log("state: ", state);
			}

			for ( var prop in reducers ) {

				newState[prop] = reducers[prop](state[prop], action);

			}

			return newState;

		};

		/**
		 * dispatch Update state
		 * @function
		 * @param  {Object} action The action to change state
		 * @param {boolean=} opt_publish Wheter this should be published
		 */
		const dispatch = function ( action, opt_publish ) {
			// Update state tree here!

			if ( goog.DEBUG ) {
				console.group(action.type);
				console.log("dispatching: ", action);
			}

			state = reduce(state, action);

			if ( opt_publish ) {

				Observer.publish(topic, getState());

			}

			if ( goog.DEBUG ) {
				console.log("next state: ", state)
				console.groupEnd();
			}

		}

		const subscribe = function ( fn ) {

			Observer.subscribe(topic, fn);
			// Provide Current State
			fn(getState());

		}

		// Return State API
		return {
			dispatch: dispatch,
			getState: getState,
			subscribe: subscribe
		};

	};

	core.State = State;
	core.state = {
		combineReducers: combineReducers
	};

	var onModuleInit = function (instanceSandbox, options, done) {

		if ( goog.DEBUG ) {
			console.group("Intializing State Plugin");
				console.log(instanceSandbox);
				console.log(options);
				console.log(done);
			console.groupEnd();
		}
		done();

	};

	var onModuleDestroy = function (done) {

		if ( goog.DEBUG ) {
			console.log("Destroying State Plugin");
		}
		done();

	};

	// don't forget to return your methods
	return {
		init: onModuleInit,
		destroy: onModuleDestroy
	};
};
