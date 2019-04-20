/**
 * @fileoverview
 *
 * Actions for Firebase
 */

goog.provide("app.actions.FirebaseActions");

/**
 * [BaseActions description]
 * @enum {Function}
 */
app.actions.FirebaseActions = {};
app.actions.FirebaseActions.isLoading = function ( loading ) {
	return {
		type: "IS_LOADING",
		payload: loading
	}
}
app.actions.FirebaseActions.isLoaded = function ( loaded ) {
	return {
		type: "IS_LOADED",
		payload: loaded
	}
}
app.actions.FirebaseActions.isAuthUser = function ( auth ) {
	return {
		type: "IS_USER",
		payload: auth
	}
}
