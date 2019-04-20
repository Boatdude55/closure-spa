/**
 * @fileoverview
 *
 * Navigationn Controller
 */
goog.provide('app.lib.interaction.NavigationInteraction');

goog.require('goog.dom');
goog.require('goog.history.Html5History');
goog.require('goog.uri.utils');
goog.require('app.lib.interaction.Interaction');
goog.require('app.lib.routing.Router');
goog.require('goog.fx.easing');
goog.require('app.lib.fx.WindowScroll');

/**
 * @constructor
 * @extends {app.lib.interaction.Interaction}
 */
app.lib.interaction.NavigationInteraction = function () {
  app.lib.interaction.NavigationInteraction.base(this, 'constructor');

  /**
   * @type {goog.history.Html5History|goog.History}
   * @protected
   */
  this.history = null;

  /**
   * @type {string}
   * @private
   */
  this.token_ = '';

  /**
   * @type {app.lib.fx.WindowScroll}
   * @private
   */
  this.scrollAnim_ = new app.lib.fx.WindowScroll(window, [0, 0], [100, 0], 5000,
    goog.fx.easing.easeOut);
};
goog.inherits(app.lib.interaction.NavigationInteraction, app.lib.interaction.Interaction);
goog.addSingletonGetter(app.lib.interaction.NavigationInteraction);

/**
 * @param {goog.events.BrowserEvent} e
 * @protected
 */
app.lib.interaction.NavigationInteraction.prototype.handleClick = function (e) {
  if (!e.isMouseActionButton()) {
    return;
  }
  // getting link element from event
  var link = e.target.href ?
    e.target :
    goog.dom.getAncestor(e.target, function(el) {
      if (el.href) {
          return true;
      }
      return false;
  });

  if (!link || !link.href || link.tagName.toLowerCase() != 'a') {
    return;
  }

  if (link.rel == 'noaction') {
    return;
  }

  var currentDomain = goog.uri.utils.getDomain(document.location.href);
  var domain = goog.uri.utils.getDomain(link.href);

  if (domain != currentDomain) {
    return;
  }

  e.preventDefault();

  // Static urls, requering redirect
  if (link.rel == 'redirect') {
    if (link.target) {
      window.open(link.href, link.target);
    }
    else {
      document.location = link.href;
    }
    return;
  }

  var path = goog.uri.utils.getPath(link.href);
  var currentPath = goog.uri.utils.getPath(document.location.href);

  if ( goog.DEBUG ) {
    console.group("NavigationInteraction.handleClick()");
    console.log("LINK: ",link);
    console.log("CURR DOMAIN: ",goog.uri.utils.getDomain(document.location.href))
    console.log("DOMAIN: ",goog.uri.utils.getDomain(link.href));
    console.log("NOT SAME DOMAIN: ",goog.uri.utils.getDomain(document.location.href) != goog.uri.utils.getDomain(link.href))
    console.log("STATIC URL: ",link.rel);
    console.log("TARGET: ",link.target);
    console.log("CURR PATH: ", goog.uri.utils.getPath(document.location.href));
    console.log("PATH: ",goog.uri.utils.getPath(link.href));
    console.log("TOKEN: ",path.substr(1));
    console.log("CURR TOKEN: ",currentPath.substr(1));
    console.groupEnd();
  }
  var token = path.substr(1);
  var currentToken = currentPath.substr(1);
  if (currentToken == token) {
    var scrollPosition = goog.dom.getDocumentScroll();
    this.scrollAnim_.setStartPoint([scrollPosition.x, scrollPosition.y]);
    this.scrollAnim_.play();
  }
  else {
    this.navigate(token, false);
  }
};

/**
 * @inheritDoc
 */
app.lib.interaction.NavigationInteraction.prototype.initialize = function (config) {
  this.history = new goog.history.Html5History();
  var useFragment = config.useFragment || false;
  this.history.setUseFragment(useFragment);

  var path = goog.uri.utils.getPath(goog.dom.getDocument().location.href);
  this.token_ = this.history.getToken();
  if (!this.token_ && !useFragment)
  {
    this.token_ = path.substr(1);
  }

  this.history.setToken(this.token_);
  this.history.setEnabled(true);
  this.history.setParentEventTarget(this);

  this.getHandler().
    listen(document.documentElement, goog.events.EventType.CLICK,
      this.handleClick).
    listen(this.history, goog.history.EventType.NAVIGATE,
      this.handleNavigate_);

  if (goog.DEBUG) {
    console.info('Initialized NavigationController with token %s', this.token_);
  }
};

/**
 * @return {string}
 */
app.lib.interaction.NavigationInteraction.prototype.getToken = function () {
  return this.history.getToken();
};

/**
 * Handles navigate event.
 *
 * @param  {goog.events.Event} e
 * @private
 */
app.lib.interaction.NavigationInteraction.prototype.handleNavigate_ = function (e) {
  if (this.token_ == e.token) {
    e.stopPropagation();
  }
  if ( goog.DEBUG ) {
    console.log("navigation => handleNavigate() hook")
  }
  this.token_ = e.token;
};

/**
 * Navigates to specified url
 *
 * @param {string} path
 * @param {boolean=} opt_replace
 */
app.lib.interaction.NavigationInteraction.prototype.navigate = function (path, opt_replace) {
  if (opt_replace) {
    this.history.replaceToken(path);
  }
  else {
    this.history.setToken(path);
  }
};