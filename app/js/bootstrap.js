/**
 * @fileoverview
 * Bootstrap for application
 */

goog.require("app.Core");
goog.require("app.Interface");
goog.require("app.Module");

// Plugins
goog.require("app.plugins.State");

var core = new app.Core(app.Interface);

core.use(app.plugins.State);
core.register(app.Module, "app");
core.start("app");