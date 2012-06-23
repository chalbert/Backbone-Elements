/**
 * |-------------------|
 * | Backbone-Elements |
 * |-------------------|
 *  Backbone-Elements is freely distributable under the MIT license.
 *
 *  <a href="https://github.com/chalbert/Backbone-Elements">More details & documentation</a>
 *
 * @author Nicolas Gilbert
 * @version 1.0
 *
 * @requires _
 * @requires Backbone
 */

(function(factory){
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone'], factory);
  } else {
    factory(_, Backbone);
  }

})(function (_, Backbone){
  'use strict';
  /**
   * @borrows Backbone.View#initialize
   */
  var initialize = Backbone.View.prototype.initialize,

      /**
       * @lends BackboneElements
       */
       BackboneElements = {

        /** @constructs*/
        initialize: function(){
          this.events = this.mapEvents(this.events);
          this.refreshElements();
          initialize.apply(this, arguments);
        },

        /**
         * @property {Object} Hash of elements & selectors
         * @example
         * elements: {
         *   content: '#content',
         *   link: 'a',
         *   button: '.btn'
         * }
         */

        elements: {},

        /**
         * Generates a standard Backbone.View events hash
         *
         * @param {Object} [eventHash] The hash of elements name & events
         */
        mapEvents: function(eventHash){
          if (!eventHash) return;

          var eventStack = {};
          _.each(eventHash, function(events, element){
            _.extend(eventStack, this.formatElementEvents(element, events));
          }, this);

          return eventStack;
        },

        /**
         * Returns the jQuery object for an element
         *
         * @param element
         * @return {jQuery Object}
         */
        $get: function (element) {
          if (!element) return $(this.el);
          this.ensureElementExist(element);

          return $(this.el).find(this.elements[element]);
        },

        /**
         * Sets a cached jQuery objects for each element
         *
         * @param {Object} [elements] New objects to add
         * @example
         * view.refreshElements({content: '#content'})
         * assert(view.$content === view.$el.find('#content');
         */
        refreshElements: function(elements){
          // Add new elements to existing ones
          elements = _.extend(this.elements || {}, elements);

          _.each(elements, function(selector, element) {
            this['$' + element] = $(this.el).find(selector);
          }, this);
        },

        /**
         * Return 'true' if 'element' is an element
         *
         * @param {String} element Element name
         * @returns True if an element of this name exists
         */
        isElement: function(element){
          if (element === '') return true;
          return (this.elements) && (this.elements[element]);
        },

        /**
         * Format an element-based event into a standard Backbone.View event
         *
         * @param {String} element Element name
         * @param {String} eventString Space-separated list of events
         * @returns {Object} Hash of events
         *
         * @example
         * events: {
         *   element: 'click focus'
         * }
         *
         * will be converted to:
         *
         * events: {
         *   'click .my-selector': 'element_click',
         *   'focus .my-selector': 'element_focus'
         * }
         */

        formatElementEvents: function(element, eventString){
          this.ensureElementExist(element);
          var events = eventString.split(' '),
              eventStack = {};

          _.each(events, function(event){
            var key = this.getEventKey(element, event),
                method = this.getEventMethod(element, event);

            eventStack[key] = method;

          }, this);

          return eventStack;
        },

        /**
         *
         * @returns {String} Either empty for root element, or selector
         * @param {String} element The element name
         */
        getElementSelector: function(element){
          return (element === '')
              ? ''
              : this.elements[element];
        },

        /**
         * Ensure the requested element exist
         *
         * @throws {Error} If the element doesn't exist
         * @param {String} element The element name
         */
        ensureElementExist: function(element){
          if (!this.isElement(element)) {
            throw "Element '" + element + "' does not exist.";
          }
        },

        /**
         * Generates the key for the event hash
         *
         * @param {String} element Element's name
         * @param {String} event Event name
         */
        getEventKey: function(element, event){
          var selector = this.getElementSelector(element),
              key = event + ((selector === '') ? '' : (' ' + selector));
          return key;
        },

        /**
         * Generates the name of the method
         *
         * @param {String} element Element's name
         * @param {String} event Event name
         *
         * @returns {String} The name of the callback method
         */

        getEventMethod: function(element, event){
          // Replace event attributes
          event = event.replace(':', '_');

          // If element is not empty, join to the event's name with underscore
          return (element ? element + '_' : '') + event;
        }

      };

  /**
   * Add BackboneElements to Backbone.View
   *
   * @name Backbone.View
   * @borrows BackboneElements
   * @lends Backbone.View.prototype
   */
  _.extend(Backbone.View.prototype, BackboneElements);

  return Backbone;

});