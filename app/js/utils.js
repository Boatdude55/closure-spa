/**
 * @fileoverview
 *
 * Utility functions for the app
 */

goog.provide("app.lib.utils");

var fnRgx = /function[^(]*\(([^)]*)\)/;
var argRgx = /([^\s,]+)/g;
var __slice = [].slice;

/**
 * [utils description]
 * @enum {Function}
 */
app.lib.utils = {
	doForAll: doForAll,
    runParallel: runParallel,
    runSeries: runSeries,
    runFirst: runFirst,
    runWaterfall: runWaterfall,
    getArgumentNames: getArgumentNames,
    hasArgument: function(fn, idx) {

		if ( idx == null ) {

			idx = 1;

		}

		return app.lib.utils.getArgumentNames(fn).length >= idx;

	}
};

function getArgumentNames (fn) {

	var _ref;
	return ((fn != null ? (_ref = fn.toString().match(fnRgx)) != null ? _ref[1] : void 0 : void 0) || '').match(argRgx) || [];

};

function runParallel (tasks, cb, force) {

	var count, errors, hasErr, i, results, t, _i, _len, _results;

	if ( tasks == null ) {

		tasks = [];

	}

	if ( cb == null ) {

		cb = (function() {});

	}

	count = tasks.length;
	results = [];

	if ( count === 0 ) {

		return cb(null, results);

	}

	errors = [];
	hasErr = false;
	_results = [];

	for (i = _i = 0, _len = tasks.length; _i < _len; i = ++_i) {

		t = tasks[i];
		_results.push((function(t, i) {
		var e, next;
		/**
		 * [next description]
		 * @param {...*} var_args
		 */
	    next = function(var_args) {
			var err, res;
			err = arguments[0], res = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
			if ( err ) {
				errors[i] = err;
				hasErr = true;

				if (!force) {

					return cb(errors, results);

				}

			} else {

				results[i] = res.length < 2 ? res[0] : res;

			}

			if ( --count <= 0 ) {

				if (hasErr) {

					return cb(errors, results);

				} else {

					return cb(null, results);

				}
			}
	    };

	    try {

			return t(next);

	    } catch (_error) {

	      e = _error;
	      return next(e);

	    }

	  })(t, i));
	}

	return _results;

};

function runSeries (tasks, cb, force) {

	var count, errors, hasErr, i, next, results;

	if ( tasks == null ) {

		tasks = [];

	}

	if ( cb == null ) {

		cb = (function() {});

	}

	i = -1;
	count = tasks.length;
	results = [];

	if ( count === 0 ) {

		return cb(null, results);

	}

	errors = [];
	hasErr = false;

	/**
	 * [next description]
	 * @param  {...*}   var_args [description]
	 */
	next = function(var_args) {

		var e, err, res;

		err = arguments[0], res = 2 <= arguments.length ? __slice.call(arguments, 1) : [];

		if ( err ) {

			errors[i] = err;
			hasErr = true;

			if (!force) {

				return cb(errors, results);
			}

		} else {

			if (i > -1) {

				results[i] = res.length < 2 ? res[0] : res;

			}

		}

		if ( ++i >= count ) {

			if (hasErr) {

				return cb(errors, results);

			} else {

				return cb(null, results);
			}

		} else {

			try {

				return tasks[i](next);

			} catch (_error) {

				e = _error;
				return next(e);

			}
		}
	};

	return next();

};

function runFirst (tasks, cb, force) {

	var count, errors, i, next, result;

	if ( tasks == null ) {

	tasks = [];

	}

	if ( cb == null ) {

	cb = (function() {});

	}

	i = -1;
	count = tasks.length;
	result = null;

	if ( count === 0 ) {

	return cb(null);

	}

	errors = [];

	/**
	 * [next description]
	 * @param  {...*}   var_args [description]
	 */
	next = function(var_args) {

		var e, err, res;

		err = arguments[0], res = 2 <= arguments.length ? __slice.call(arguments, 1) : [];

		if ( err ) {

			errors[i] = err;

			if ( !force ) {

				return cb(errors);

			}

		} else {

			if ( i > -1 ) {

				return cb(null, res.length < 2 ? res[0] : res);
			}
		}

		if ( ++i >= count ) {

			return cb(errors);

		} else {
			try {

				return tasks[i](next);

			} catch (_error) {

				e = _error;

				return next(e);

			}
		}

	};

	return next();

};

function runWaterfall (tasks, cb) {

	var i, next;
	i = -1;

	if (tasks.length === 0) {

		return cb();

	}

	/**
	 * [next description]
	 * @param  {...*}   var_args [description]
	 */
	next = function(var_args) {

		var err, res;

		err = arguments[0], res = 2 <= arguments.length ? __slice.call(arguments, 1) : [];

		if (err != null) {

			return cb(err);

		}

		if (++i >= tasks.length) {

			return cb.apply(null, [null].concat(__slice.call(res)));

		} else {

			return tasks[i].apply(tasks, __slice.call(res).concat([next]));

		}

	};

	return next();

};

function doForAll (args, fn, cb, force) {

	var a, tasks;

	if (args == null) {

		args = [];

	}

	tasks = (function() {

		var _i, _len, _results;

		_results = [];

		for (_i = 0, _len = args.length; _i < _len; _i++) {

			a = args[_i];
			_results.push((function(a) {

				return function(next) {

					return fn(a, next);

				};

			})(a));
		}

		return _results;

	})();

	return app.lib.utils.runParallel(tasks, cb, force);

};