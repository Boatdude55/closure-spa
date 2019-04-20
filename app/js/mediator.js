/**
 * @fileoverview
 *
 * The core of the application
 * Manages the applications lifecycle
 * Responsible for Adding and Removing Modules
 * Manages errors from modules
 * Central point of communication for modules
 */

goog.provide("app.Core");

goog.require("goog.string");
goog.require("goog.pubsub.PubSub");
goog.require("app.lib.utils");

/**
 * [Core description]
 * @extends {goog.pubsub.PubSub}
 * @param {Function} facade [description]
 * @constructor
 */
app.Core = function ( facade ) {
	app.Core.base(this, 'constructor', true);

	var moduleData = {};
	var err;
	this.Sandbox = facade;

	if ( err ) {

		throw new Error(err);

	}

	this.modules_ = {};
	this.plugins_ = [];
	this.instances_ = {};
	this.sandboxes_ = {};
	this.running_ = {};

};
goog.inherits(app.Core, goog.pubsub.PubSub);
goog.addSingletonGetter(app.Core);

app.Core.prototype.log = {
	error: function(e) {console.error(e)},
	log: function(e) {console.log(e)},
	info: function(e) {console.info(e)},
	warn: function(e) {console.warn(e)},
	enable: function(e) {console.log(e)}
};

/**
 * [register description]
 * @param  {Object|null} creator [description]
 * @param {string=} moduleId [description]
 * @param  {Object=} options [description]
 * @return {*}         [description]
 */
app.Core.prototype.register = function(creator, moduleId, options) {

	var err, id;

	id = goog.getUid(creator);

	if (options == null) {
		options = {};
	}

	if (moduleId in this.modules_) {
		console.warn("module " + moduleId + " was already registered");
		return this;
	}

	this.modules_[moduleId] = {
		creator: creator,
		options: options,
		id: id
	};

	return this;

};

/**
 * [start description]
 * @param  {string=}   moduleId [description]
 * @param  {Object=}   opt      [description]
 * @param  {Function=} cb       [description]
 */
app.Core.prototype.start = function(moduleId, opt, cb) {

	var e, id, initInst;

	if ( cb == null ) {

		cb = function () {

			// console.log("%cApp Bootstrapped Successfully!", app.lib.console.styles.success);

		}

	}

	if (arguments.length === 0) {

		return this.startAll_(cb);

	}

	// e = checkType("string", moduleId, "module ID") || checkType("object", opt, "second parameter") || (!this._modules[moduleId] ? "module doesn't exist" : void 0);

	if (e) {

		return this.startFail_(e, cb);

	}

	if (opt == null) {
		opt = {};

	}

	id = opt.instanceId || moduleId;

	if (this.running_[id] === true) {

		return this.startFail_(new Error("module was already started"), cb);

	}

	initInst = (function(_this) {

		return function(err, instance, opt) {

			if (err) {
				return _this.startFail_(err, cb);
			}

			try {
				
				if ( app.lib.utils.hasArgument(instance.init, 2) ) {

					return instance.start(opt, function(err) {

						if (!err) {
							_this.running_[id] = true;
						}

						return cb(err);
					});

				} else {

					instance.start(opt);
					_this.running_[id] = true;
					return cb();

				}

			} catch (_error) {

				e = _error;
				return _this.startFail_(e, cb);

			}

		};

	})(this);

	return this.boot((function(_this) {

		return function(err) {

			if (err) {

				return _this.startFail_(err, cb);

			}

			return _this.createInstance_(moduleId, opt, initInst);

		};

	})(this));

};

app.Core.prototype.startFail_ = function(e, cb) {

	this.log.error(e);

	cb(new Error("could not start module: " + e.message));

	return this;

};

app.Core.prototype.createInstance_ = function(moduleId, o, cb) {

	var Sandbox, iOpts, id, key, module, obj, opt, sb, val, _i, _len, _ref;

	id = o.instanceId || moduleId;
	// opt = o.options;
	opt = o;
	module = this.modules_[moduleId];

	if (this.instances_[id]) {

	return cb(this.instances_[id]);

	}

	iOpts = {};
	_ref = [module.options, opt];

	for (_i = 0, _len = _ref.length; _i < _len; _i++) {

		obj = _ref[_i];

		if (obj) {

			for ( key in obj ) {

				val = obj[key];

				if ( iOpts[key] == null ) {

					iOpts[key] = val;

				}

			}

		}

	}

	Sandbox = typeof o.sandbox === 'function' ? o.sandbox : this.Sandbox;
	sb = new Sandbox(this, id, iOpts, moduleId);

	return this.runSandboxPlugins_('init', sb, (function(_this) {

		return function(err) {

			var instance;
			instance = new module.creator(sb);

			if ( typeof instance.start !== "function" ) {

				return cb(new Error("module has no 'start' method"));

			}

			_this.instances_[id] = instance;
			_this.sandboxes_[id] = sb;

			return cb(null, instance, iOpts);

		};

	})(this));

};

/**
 * [startAll_ description]
 * @param  {?Function} cb   [description]
 * @param  {Array<Object>=}   mods [description]
 */
app.Core.prototype.startAll_ = function(cb, mods) {

	var done, m, startAction;

	if (mods == null) {

		mods = (function() {

			var results_;
			results_ = [];

			for (m in this.modules_) {

				results_.push(m);

			}

			return results_;

		}).call(this);

	}

	startAction = (function(this_) {

		return function(m, next) {

			return this_.start(m, this_.modules_[m].options, next);

		};

	})(this);

	done = function(err) {

		var e, i, k, mdls, modErrors, x, _i, _len;

		if ((err != null ? err.length : void 0) > 0) {

			modErrors = {};

			for (i = _i = 0, _len = err.length; _i < _len; i = ++_i) {
				x = err[i];
				if (x != null) {
					modErrors[mods[i]] = x;
				}
			}

			mdls = (function() {

				var _results;

				_results = [];

				for (k in modErrors) {

					_results.push("'" + k + "'");

				}

				return _results;

			})();

			e = new Error("errors occurred in the following modules: " + mdls);
			e.moduleErrors = modErrors;

		}


		return typeof cb === "function" ? cb(e) : void 0;

	};

	app.lib.utils.doForAll(mods, startAction, done, true);

	return this;
};

app.Core.prototype.stop = function(id, cb) {
	var instance, x;

	if (cb == null) {

		cb = function() {};

	}

	if ( instance = this.instances_[id] ) {

		delete this.instances_[id];

		if ( typeof instance.destroy === "function" ) {

			instance.destroy();

		}

		delete this.running_[id];

	}

	return this;
};

/**
 * [use description]
 * @param  {*} plugin [description]
 * @param  {*=} opt    [description]
 */
app.Core.prototype.use = function( plugin, opt ) {
	var p, _i, _len;

	if ( plugin instanceof Array ) {

		for ( _i = 0, _len = plugin.length; _i < _len; _i++ ) {

			p = plugin[_i];

			switch (typeof p) {
				case "function":
					this.use(p);
					break;
				case "object":
					this.use(p.plugin, p.options);
			}
		}

	} else {

		if ( typeof plugin !== "function" ) {

			return this;

		}

		this.plugins_.push({
			creator: plugin,
			options: opt
		});

	}

	return this;
};

app.Core.prototype.boot = function( cb ) {

	var core, p, tasks;

	core = this;

	tasks = (function() {

		var _i, _len, _ref, _results;

		_ref = this.plugins_;
		_results = [];

		for (_i = 0, _len = _ref.length; _i < _len; _i++) {

			p = _ref[_i];

			if ( p.booted !== true ) {

				_results.push((function(p) {

					if (app.lib.utils.hasArgument(p.creator, 3)) {

						return function(next) {

							var plugin;

							return plugin = p.creator(core, p.options, function(err) {

								if (!err) {

									p.booted = true;
									p.plugin = plugin;

								}

								return next();

							});

						};

					} else {

						return function(next) {

							p.plugin = p.creator(core, p.options);
							p.booted = true;

							return next();

						};

					}

				})(p));

			}

		}

		return _results;

	}).call(this);

	app.lib.utils.runSeries(tasks, cb, true);

	return this;

};

/**
 * [runSandboxPlugins_ description]
 * @param  {string}   ev [description]
 * @param  {*}   sb [description]
 * @param  {Function} cb [description]
 */
app.Core.prototype.runSandboxPlugins_ = function (ev, sb, cb) {

	var p, tasks;

	tasks = (function() {

		var _i, _len, _ref, _ref1, _results;

		_ref = this.plugins_;
		_results = [];

		for (_i = 0, _len = _ref.length; _i < _len; _i++) {

			p = _ref[_i];

			if (typeof ((_ref1 = p.plugin) != null ? _ref1[ev] : void 0) === "function") {

				_results.push((function(p) {

					var fn;

					fn = p.plugin[ev];

					return function(next) {

						if (app.lib.utils.hasArgument(fn, 3)) {

							return fn(sb, p.options, next);

						} else {

							fn(sb, p.options);

							return next();

						}

					};

				})(p));

			}

		}

		return _results;

	}).call(this);

	return app.lib.utils.runSeries(tasks, cb, true);

};