/**
 * @fileoverview
 *
 * Reducers for App
 */

goog.provide("app.reducers.FirebaseReducers");

/**
 * [BaseActions description]
 * @enum {Function}
 */
app.reducers.FirebaseReducers = {};
/**
 * [AppReducer description]
 * @param {Object} state  Current State
 * @param {{type:string, payload:*}} action Action to update state
 */
app.reducers.FirebaseReducers.loaded = function ( state, action ) {
	switch ( action.type ) {
		case 'IS_LOADED':
			return action.payload;
		default:
			return state;
	}
};
/**
 * [AppReducer description]
 * @param {Object} state  Current State
 * @param {{type:string, payload:*}} action Action to update state
 */
app.reducers.FirebaseReducers.loading = function ( state, action ) {
	switch ( action.type ) {
		case 'IS_LOADING':
			return action.payload;
		default:
			return state;
	}
};
/**
 * [AppReducer description]
 * @param {Object} state  Current State
 * @param {{type:string, payload:*}} action Action to update state
 */
app.reducers.FirebaseReducers.user = function ( state, action ) {
	switch ( action.type ) {
		case 'IS_USER':
			return action.payload;
		default:
			return state;
	}
};
