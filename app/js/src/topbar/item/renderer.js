/**
 * @fileoverview Renderer for {@link app.structor.TopBarItem}s.
 *
 * @author attila@google.com (Attila Bodis)
 */

goog.provide('app.structor.TopBarItemRenderer');

goog.require('goog.a11y.aria.Role');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.ui.Component');
goog.require('goog.ui.ControlRenderer');



/**
 * Default renderer for {@link app.structor.TopBarItem}s.  Each item has the following
 * structure:
 *
 *    <div class="goog-menuitem">
 *      <div class="goog-menuitem-content">
 *        ...(menu item contents)...
 *      </div>
 *    </div>
 *
 * @constructor
 * @extends {goog.ui.ControlRenderer}
 */
app.structor.TopBarItemRenderer = function() {
  goog.ui.ControlRenderer.call(this);

  /**
   * Commonly used CSS class names, cached here for convenience (and to avoid
   * unnecessary string concatenation).
   * @type {!Array<string>}
   * @private
   */
  this.classNameCache_ = [];
};
goog.inherits(app.structor.TopBarItemRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(app.structor.TopBarItemRenderer);


/**
 * CSS class name the renderer applies to menu item elements.
 * @type {string}
 */
app.structor.TopBarItemRenderer.CSS_CLASS = goog.getCssName('ui-structor-topbar-item');


/**
 * Constants for referencing composite CSS classes.
 * @enum {number}
 * @private
 */
app.structor.TopBarItemRenderer.CompositeCssClassIndex_ = {
  HOVER: 0,
  CHECKBOX: 1,
  CONTENT: 2
};


/**
 * Returns the composite CSS class by using the cached value or by constructing
 * the value from the base CSS class and the passed index.
 * @param {app.structor.TopBarItemRenderer.CompositeCssClassIndex_} index Index for the
 *     CSS class - could be highlight, checkbox or content in usual cases.
 * @return {string} The composite CSS class.
 * @private
 */
app.structor.TopBarItemRenderer.prototype.getCompositeCssClass_ = function(index) {
  var result = this.classNameCache_[index];
  if (!result) {
    switch (index) {
      case app.structor.TopBarItemRenderer.CompositeCssClassIndex_.HOVER:
        result = goog.getCssName(this.getStructuralCssClass(), 'highlight');
        break;
      case app.structor.TopBarItemRenderer.CompositeCssClassIndex_.CHECKBOX:
        result = goog.getCssName(this.getStructuralCssClass(), 'checkbox');
        break;
      case app.structor.TopBarItemRenderer.CompositeCssClassIndex_.CONTENT:
        result = goog.getCssName(this.getStructuralCssClass(), 'content');
        break;
    }
    this.classNameCache_[index] = result;
  }

  return result;
};


/** @override */
app.structor.TopBarItemRenderer.prototype.getAriaRole = function() {
  return goog.a11y.aria.Role.MENU_ITEM;
};


/**
 * Overrides {@link goog.ui.ControlRenderer#createDom} by adding extra markup
 * and stying to the menu item's element if it is selectable or checkable.
 * @param {goog.ui.Control} item Menu item to render.
 * @return {Element} Root element for the item.
 * @override
 */
app.structor.TopBarItemRenderer.prototype.createDom = function(item) {
  var element = item.getDomHelper().createDom(
      goog.dom.TagName.DIV, this.getClassNames(item).join(' '),
      this.createContent(item.getContent(), item.getDomHelper()));
  this.setEnableCheckBoxStructure(
      item, element, item.isSupportedState(goog.ui.Component.State.SELECTED) ||
          item.isSupportedState(goog.ui.Component.State.CHECKED));
  return element;
};


/** @override */
app.structor.TopBarItemRenderer.prototype.getContentElement = function(element) {
  return /** @type {Element} */ (element && element.firstChild);
};


/**
 * Overrides {@link goog.ui.ControlRenderer#decorate} by initializing the
 * menu item to checkable based on whether the element to be decorated has
 * extra stying indicating that it should be.
 * @param {goog.ui.Control} item Menu item instance to decorate the element.
 * @param {Element} element Element to decorate.
 * @return {Element} Decorated element.
 * @override
 */
app.structor.TopBarItemRenderer.prototype.decorate = function(item, element) {
  goog.asserts.assert(element);
  if (!this.hasContentStructure(element)) {
    element.appendChild(
        this.createContent(element.childNodes, item.getDomHelper()));
  }
  if (goog.dom.classlist.contains(element, goog.getCssName('goog-option'))) {
    (/** @type {app.structor.TopBarItem} */ (item)).setCheckable(true);
    this.setCheckable(item, element, true);
  }
  return app.structor.TopBarItemRenderer.superClass_.decorate.call(
      this, item, element);
};


/**
 * Takes a menu item's root element, and sets its content to the given text
 * caption or DOM structure.  Overrides the superclass immplementation by
 * making sure that the checkbox structure (for selectable/checkable menu
 * items) is preserved.
 * @param {Element} element The item's root element.
 * @param {goog.ui.ControlContent} content Text caption or DOM structure to be
 *     set as the item's content.
 * @override
 */
app.structor.TopBarItemRenderer.prototype.setContent = function(element, content) {
  // Save the checkbox element, if present.
  var contentElement = this.getContentElement(element);
  var checkBoxElement =
      this.hasCheckBoxStructure(element) ? contentElement.firstChild : null;
  app.structor.TopBarItemRenderer.superClass_.setContent.call(this, element, content);
  if (checkBoxElement && !this.hasCheckBoxStructure(element)) {
    // The call to setContent() blew away the checkbox element; reattach it.
    contentElement.insertBefore(
        checkBoxElement, contentElement.firstChild || null);
  }
};


/**
 * Returns true if the element appears to have a proper menu item structure by
 * checking whether its first child has the appropriate structural class name.
 * @param {Element} element Element to check.
 * @return {boolean} Whether the element appears to have a proper menu item DOM.
 * @protected
 */
app.structor.TopBarItemRenderer.prototype.hasContentStructure = function(element) {
  var child = goog.dom.getFirstElementChild(element);
  var contentClassName = this.getCompositeCssClass_(
      app.structor.TopBarItemRenderer.CompositeCssClassIndex_.CONTENT);
  return !!child && goog.dom.classlist.contains(child, contentClassName);
};


/**
 * Wraps the given text caption or existing DOM node(s) in a structural element
 * containing the menu item's contents.
 * @param {goog.ui.ControlContent} content Menu item contents.
 * @param {goog.dom.DomHelper} dom DOM helper for document interaction.
 * @return {Element} Menu item content element.
 * @protected
 */
app.structor.TopBarItemRenderer.prototype.createContent = function(content, dom) {
  var contentClassName = this.getCompositeCssClass_(
      app.structor.TopBarItemRenderer.CompositeCssClassIndex_.CONTENT);
  return dom.createDom(goog.dom.TagName.DIV, contentClassName, content);
};


/**
 * Enables/disables radio button semantics on the menu item.
 * @param {goog.ui.Control} item Menu item to update.
 * @param {Element} element Menu item element to update (may be null if the
 *     item hasn't been rendered yet).
 * @param {boolean} selectable Whether the item should be selectable.
 */
app.structor.TopBarItemRenderer.prototype.setSelectable = function(
    item, element, selectable) {
  if (item && element) {
    this.setEnableCheckBoxStructure(item, element, selectable);
  }
};


/**
 * Enables/disables checkbox semantics on the menu item.
 * @param {goog.ui.Control} item Menu item to update.
 * @param {Element} element Menu item element to update (may be null if the
 *     item hasn't been rendered yet).
 * @param {boolean} checkable Whether the item should be checkable.
 */
app.structor.TopBarItemRenderer.prototype.setCheckable = function(
    item, element, checkable) {
  if (item && element) {
    this.setEnableCheckBoxStructure(item, element, checkable);
  }
};


/**
 * Determines whether the item contains a checkbox element.
 * @param {Element} element Menu item root element.
 * @return {boolean} Whether the element contains a checkbox element.
 * @protected
 */
app.structor.TopBarItemRenderer.prototype.hasCheckBoxStructure = function(element) {
  var contentElement = this.getContentElement(element);
  if (contentElement) {
    var child = contentElement.firstChild;
    var checkboxClassName = this.getCompositeCssClass_(
        app.structor.TopBarItemRenderer.CompositeCssClassIndex_.CHECKBOX);
    return !!child && goog.dom.isElement(child) &&
        goog.dom.classlist.contains(
            /** @type {!Element} */ (child), checkboxClassName);
  }
  return false;
};


/**
 * Adds or removes extra markup and CSS styling to the menu item to make it
 * selectable or non-selectable, depending on the value of the
 * `selectable` argument.
 * @param {!goog.ui.Control} item Menu item to update.
 * @param {!Element} element Menu item element to update.
 * @param {boolean} enable Whether to add or remove the checkbox structure.
 * @protected
 */
app.structor.TopBarItemRenderer.prototype.setEnableCheckBoxStructure = function(
    item, element, enable) {
  this.setAriaRole(element, item.getPreferredAriaRole());
  this.setAriaStates(item, element);
  if (enable != this.hasCheckBoxStructure(element)) {
    goog.dom.classlist.enable(element, goog.getCssName('goog-option'), enable);
    var contentElement = this.getContentElement(element);
    if (enable) {
      // Insert checkbox structure.
      var checkboxClassName = this.getCompositeCssClass_(
          app.structor.TopBarItemRenderer.CompositeCssClassIndex_.CHECKBOX);
      contentElement.insertBefore(
          item.getDomHelper().createDom(
              goog.dom.TagName.DIV, checkboxClassName),
          contentElement.firstChild || null);
    } else {
      // Remove checkbox structure.
      contentElement.removeChild(contentElement.firstChild);
    }
  }
};


/**
 * Takes a single {@link goog.ui.Component.State}, and returns the
 * corresponding CSS class name (null if none).  Overrides the superclass
 * implementation by using 'highlight' as opposed to 'hover' as the CSS
 * class name suffix for the HOVER state, for backwards compatibility.
 * @param {goog.ui.Component.State} state Component state.
 * @return {string|undefined} CSS class representing the given state
 *     (undefined if none).
 * @override
 */
app.structor.TopBarItemRenderer.prototype.getClassForState = function(state) {
  switch (state) {
    case goog.ui.Component.State.HOVER:
      // We use 'highlight' as the suffix, for backwards compatibility.
      return this.getCompositeCssClass_(
          app.structor.TopBarItemRenderer.CompositeCssClassIndex_.HOVER);
    case goog.ui.Component.State.CHECKED:
    case goog.ui.Component.State.SELECTED:
      // We use 'goog-option-selected' as the class, for backwards
      // compatibility.
      return goog.getCssName('goog-option-selected');
    default:
      return app.structor.TopBarItemRenderer.superClass_.getClassForState.call(
          this, state);
  }
};


/**
 * Takes a single CSS class name which may represent a component state, and
 * returns the corresponding component state (0x00 if none).  Overrides the
 * superclass implementation by treating 'goog-option-selected' as special,
 * for backwards compatibility.
 * @param {string} className CSS class name, possibly representing a component
 *     state.
 * @return {goog.ui.Component.State} state Component state corresponding
 *     to the given CSS class (0x00 if none).
 * @override
 */
app.structor.TopBarItemRenderer.prototype.getStateFromClass = function(className) {
  var hoverClassName = this.getCompositeCssClass_(
      app.structor.TopBarItemRenderer.CompositeCssClassIndex_.HOVER);
  switch (className) {
    case goog.getCssName('goog-option-selected'):
      return goog.ui.Component.State.CHECKED;
    case hoverClassName:
      return goog.ui.Component.State.HOVER;
    default:
      return app.structor.TopBarItemRenderer.superClass_.getStateFromClass.call(
          this, className);
  }
};


/** @override */
app.structor.TopBarItemRenderer.prototype.getCssClass = function() {
  return app.structor.TopBarItemRenderer.CSS_CLASS;
};