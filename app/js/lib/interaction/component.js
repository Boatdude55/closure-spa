/**
 * @fileoverview
 * Structor Interaction
 */
goog.provide('app.lib.interaction.ComponentInteraction');

goog.require('app.lib.interaction.Interaction');
goog.require('goog.ui.decorate');
goog.require('goog.structs.Map');
goog.require('goog.dom.dataset');

/**
 * @constructor
 * @extends {app.lib.interaction.Interaction}
 */
app.lib.interaction.ComponentInteraction = function()
{
  goog.base(this);

  /**
   * @type {goog.structs.Map}
   * @private
   */
  this.components_ = new goog.structs.Map();
};
goog.inherits(app.lib.interaction.ComponentInteraction, app.lib.interaction.Interaction);

goog.addSingletonGetter(app.lib.interaction.ComponentInteraction);

/**
 * Destroys component with specified name.
 *
 * @param  {Element} element
 * @param  {string=} opt_selector
 */
app.lib.interaction.ComponentInteraction.prototype.destroy = function(element,
  opt_selector)
{
  var selector = opt_selector || '.cmp';
  var elements = element.querySelectorAll(selector);

  for (var i = 0; i < elements.length; i++)
  {
    var name = goog.dom.dataset.get(elements[i], 'name') ||
      goog.getUid(elements[i]);

    var cmp = this.components_.get(name);
    if (name && cmp)
    {
      if (goog.DEBUG)
      {
        console.info('Destroyed component %o', cmp);
      }

      cmp.dispose();
      this.components_.remove(name);
    }
  }
};

/** @inheritDoc */
app.lib.interaction.ComponentInteraction.prototype.disposeInternal = function()
{
  goog.base(this, 'disposeInternal');

  if (goog.DEBUG)
  {
    console.info('Disposing components: %o', this.components_.getValues());
  }

  goog.disposeAll(this.components_.getValues());
};

/**
 * Returns list of all components
 *
 * @return {Array.<goog.ui.Component>}
 */
app.lib.interaction.ComponentInteraction.prototype.getAll = function()
{
  return this.components_.getValues();
};

/**
 * Returns component by specified name
 *
 * @param {string} name
 * @return {goog.ui.Component}
 */
app.lib.interaction.ComponentInteraction.prototype.getComponentByName =
  function(name)
{
  return this.components_.get(name);
};

/**
 * Returns component for element.
 *
 * @param {Element} element
 * @return {goog.ui.Component}
 */
app.lib.interaction.ComponentInteraction.prototype.getComponentForElement =
  function(element)
{
  var name = goog.dom.dataset.get(element, 'name') ||
      goog.getUid(element);

  return this.components_.get(name);
};


/**
 * Initializes components
 *
 * @param {Object} config
 * @return {Array<goog.ui.Component>}
 */
app.lib.interaction.ComponentInteraction.prototype.initialize =
  function(config)
{
  var element = config.element || document.body;
  var selector = config.selector || '.cmp';
  var elements = element.querySelectorAll(selector);

  var components = [];

  for (var i = 0; i < elements.length; i++)
  {
    var name = goog.dom.dataset.get(elements[i], 'name') ||
      goog.getUid(elements[i]);

    // Component already initialized.
    if (name && this.components_.get(name))
    {
      if (goog.DEBUG)
      {
        console.warn('Component with the same name already exists %s %o.',
          name, elements[i]);
      }
      continue;
    }
    var cmp = goog.ui.decorate(elements[i]);

    if (!cmp)
    {
      console.warn('Couldn\'t initialize component %o', elements[i]);
      continue;
    }
    else if (goog.DEBUG)
    {
      console.info('Initialized component %s: %o %o', name, cmp, elements[i]);
    }

    this.components_.set(name, cmp);
    cmp.setParentEventTarget(this);
    components.push(cmp);
  }

  return components;
};