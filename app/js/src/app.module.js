/**
 * @fileoverview
 *
 * Main module for the SPA
 */
goog.provide('app.Module');

goog.require('goog.events.EventTarget');
goog.require('goog.history.EventType');
goog.require('goog.history.Html5History');
goog.require('goog.structs.Map');
goog.require('goog.dom');
goog.require('goog.style');

goog.require('app.StructorFactory');
goog.require('app.lib.structor.Factory');
goog.require('app.lib.routing.Router');
goog.require('app.lib.routing.Route');
goog.require('app.lib.interaction.NavigationInteraction');

goog.require('app.structor.TopBar');
/**
* Manages the data and interface for a single note.
* @constructor
* @extends {goog.events.EventTarget}
* @param {app.Interface} sandbox Facade for Application Core
*/
app.Module = function( sandbox ) {
  app.Module.base(this, 'constructor');

  /**
   * Event handler for processing of local events.
   *
   * @type {goog.events.EventHandler}
   * @private
   */
  this.handler_ = new goog.events.EventHandler(this);

  /**
   * List of all loaded interactions.
   * @type {goog.structs.Map}
   * @private
   */
  this.interactions_ = new goog.structs.Map();

  /**
   * Current structor.
   *
   * @protected
   */
  this.structor = null;

  /**
   * Element used with initial structor initialization.
   *
   * @type {Element}
   * @private
   */
  this.initialStructorElement_ = null;

  /**
   * Structor Factory
   *
   * @type {app.lib.structor.Factory}
   */
  // this.structorFactory = app.lib.structor.Factory.getInstance();
  this.structorFactory = app.StructorFactory.getInstance();

  /**
   * @type {app.lib.routing.Router}
   * @private
   */
  this.router_ = new app.lib.routing.Router();

  /**
   * @type {Object}
   * @private
   */
  this.state_ = null;

  /**
   * An element where the structor blocks will be rendered.
   *
   * @type {Element}
   */
  this.structorContainer;
  
  this.appElement = goog.dom.getElement("spa-app");

  this.addController("navigation", new app.lib.interaction.NavigationInteraction(), {
      useFragment: true,
    });

  this.topbar = new app.structor.TopBar();
};
goog.inherits(app.Module, goog.events.EventTarget);

/**
 * @param {string} name
 * @param {app.lib.interaction.Interaction} interaction
 * @param {Object=} opt_config Initialization config
 * @return {app.Module}
 */
app.Module.prototype.addController = function (name, interaction, opt_config) {

  if (opt_config) {
    interaction.initialize(opt_config);
  }

  interaction.setParentEventTarget(this);

  this.interactions_.set(name, interaction);

  return this;

};

/**
 * @param {string} urlToken
 */
app.Module.prototype.navigate = function (urlToken) {
  if ( goog.DEBUG ) {
    console.log("navigate()...: ", urlToken);
  }
  this.router_.match(urlToken);
};

/**
 * @protected
 */
app.Module.prototype.removeStructor = function () {
  if (this.structor)
  {
    goog.dom.removeNode(this.structor.getElement());
    goog.dispose(this.structor);
    this.structor = null;

    if (goog.DEBUG)
    {
      console.info('Disposed structor %o', this.structor);
    }
  }
};

/**
 * @param {app.lib.structor.Structor} structor
 */
app.Module.prototype.setStructor = function (structor) {
  if (structor == this.structor) {
    return;
  }

  this.removeStructor();

  if (goog.DEBUG) {
    console.info('ModularApp: Changing structor to %o.', structor);
  }

  this.structor = structor;
  if (!structor.getElement()) {
    if (this.initialStructorElement_) {
      this.structor.decorate(this.initialStructorElement_);
      this.initialStructorElement_ = null;
    }
    else {
      this.structor.render(this.structorContainer);
    }
  }
  window.scrollTo(0, 0);

  this.structor.setParentEventTarget(this);
  this.dispatchEvent(app.Module.EventType.STRUCTOR_CHANGE);
};

/**
 * Sets structor from previously saved state.
 *
 * @private
 */
app.Module.prototype.setStructorFromState_ = function()
{
  var structor = this.structorFactory.getStructor(this.state_.route.name);
  this.setStructor(structor);

  if (!structor && goog.DEBUG)
  {
    console.warn('ModularApp: structor not found ' + this.state_.route.name + '.');
  }

  if (this.structor)
  {
    this.structor.setState(this.state_);
    this.dispatchEvent(app.Module.EventType.STATE_CHANGE);
  }
};

/**
 * Sets new state of the app.
 *
* @param {Object} state
*/
app.Module.prototype.setState = function(state)
{
  if (this.structor && this.state_.route.name == state.route.name) {
    this.structor.setState(state);
    this.state_ = state;
    this.dispatchEvent(app.Module.EventType.STATE_CHANGE);
    return;
  }

  this.removeStructor();

  if ( goog.DEBUG ) {
    console.info('ModularApp: Setting state %o', state);
  }

  this.state_ = state;

  this.setStructorFromState_();

};

/**
 * Handles navigate event.
 *
 * @param  {app.lib.routing.RouteMatchEvent} e
 * @private
 */
app.Module.prototype.handleNavigate_ = function (e) {
  if ( goog.DEBUG ) {
    console.info('App: Navigating to %s', e.token);
  }

  this.navigate(e.token);
};

/**
 * Handles matching of route
 * @param  {app.lib.routing.RouteMatchEvent} e
 * @private
 */
app.Module.prototype.handleRouteMatch_ = function (e) {
  if ( goog.DEBUG ) {
    console.log("handleRouterMatch_()");
  }
  this.setState({
    token: e.token,
    data: e.data,
    route: e.target
  });
};

/**
 * start Intitialize Module and children
 * @param  {Object=}   opt_config [description]
 * @param  {Function=} fn  [description]
 */
app.Module.prototype.start = function(opt_config, fn) {

  if ( goog.DEBUG ) {
    console.log("Starting .... app.Module");
  }

  this.topbar.render();
  this.topbar.forEachChild(function (child, index) {
    let model = child.getModel();
    if ( model ) {
      this.router_.addRoute(new app.lib.routing.Route(model.route, model.structor));
    }
  }, this);
  goog.dom.appendChild(document.body, goog.dom.createDom(
      goog.dom.TagName.DIV, {
        id: 'ui-structor-outlet',
        class: 'ui-structor-container'
      }
    )
  );
  this.structorContainer = goog.dom.getElement('ui-structor-outlet');
  this.handler_.
      listen(this, goog.history.EventType.NAVIGATE, this.handleNavigate_).
      listen(this.router_, app.lib.routing.Route.EventType.ROUTE_MATCH,
        this.handleRouteMatch_);

  var NavigationInteraction = this.interactions_.get('navigation');

  if ( NavigationInteraction ) {

    this.navigate(NavigationInteraction.getToken());

  }
};

/**
 * @typedef {{
 *          data: Object,
 *          route: app.lib.routing.Route,
 *          token: string}}
 */
app.Module.State;

/** @enum {string} */
app.Module.EventType = {
  STATE_CHANGE: 'state_change',
  STRUCTOR_CHANGE: 'structor_change'
};
app.Module.prototype.destroy = function () {
  this.dispose();
};