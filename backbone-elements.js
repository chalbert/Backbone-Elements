define([
  'underscore',
  'backbone'
], function(_, Backbone) {

  Backbone.View = Backbone.View.extend({

    initialize: function(){
      if (this.events) this.events = this.mapEvents(this.events);
      this.refreshElements();
      this._super('initialize', arguments);
    },

    // Convention based event binding
    mapEvents: function(events){
      var eventStack = {};
      _.each(events, function(event, object){
        _.extend(eventStack, this._formatElementEvents(object, event));
      }, this);

      return eventStack;
    },

    // Util to get element jQuery object
    $get: function (element) {
      if (!element) return $(this.el);
      this._ensureElementExist(element);

      return $(this.el).find(this.elements[element]);
    },

    // Set cached version of elements jQuery objects
    refreshElements: function(element){
      var elements = element || this.elements;
      for (var element in elements) {
        this['$' + element] = $(this.el).find(this.elements[element]);
      }
    },

    _formatElementEvents: function(element, eventString){
      this._ensureElementExist(element);
      var events = eventString.split(' '),
          eventStack = {};

      _.each(events, function(event, index){

        this._ensureEventIsValid(event);

        if (this._isSpecificKeyEvent(event)) {
          this._bindSpecificKeyEvent(element, event);
        } else {
          this._pushFormattedEvent(eventStack, element, event);
        }

      }, this);

      return eventStack;
    },

    _bindSpecificKeyEvent: function(element, event) {
      var eventParts = this._getEventParts(event),
          eventName = eventParts[0],
          keyName = eventParts[1],
          data = {
            key: _.getKeycode(keyName),
            keyName: keyName,
            el: element
          },
          router = _.bind(this._keyEventRouter, this);

      this._ensureEventMethodExist(element, eventName, keyName);

      if (element === '') {
        this.$get().bind(eventName, data, router);
      } else {
        this.$get().delegate(this._getElementSelector(element), eventName, data, router);
      }
    },

    _pushFormattedEvent: function(stack, element, event){
      var selector = this._getElementSelector(element),
          key = (selector !== '') ? event + ' ' + selector : event;

      stack[key] = this._getEventMethod(element, event);
      return stack;
    },

    isElement: function(element){
      if (element === '') return true;
      return (this.elements) && (this.elements[element]);
    },

    _getElementSelector: function(element){
      if (element === '') return '';
      return this.elements[element];
    },

    _ensureElementExist: function(element){
      if (!this.isElement(element)) {
        throw "Element '" + element + "' does not exist.";
      }
    },

    _ensureEventMethodExist: function(element, event, attribute){
      var methodName = this._getEventMethod(element, event, attribute),
          method = this[methodName];
      if (!method) throw new Error('Event\'s method "' + methodName + '" does not exist');
    },

    _getEventMethod: function(element, event, attribute){
      var methodPrefix = element ? element + '_' : '',
          methodSuffix = attribute ? '_' + attribute : '';

      return methodPrefix + event + methodSuffix;
    },

    _getEventParts: function (event) {
      eventParts = event.split(':');
      return eventParts;
    },

    _keyEventRouter: function(e) {
      if (e.data.key === e.which) {
        var method = this._getEventMethod(e.data.el, e.type, e.data.keyName);
        this[method].apply(this);
      }
    },

    _isValidEvent: function(event){
      //| > Only key event take options
      return (!this._isEventWithOption(event) || this._isSpecificKeyEvent(event));
    },

    _ensureEventIsValid: function(event){
      if (!this._isValidEvent(event)) {
        throw "This event does not exist: " + element;
      }
    },

    _isEventWithOption: function(event){
      return (event.indexOf(':') !== -1);
    },

    _isSpecificKeyEvent: function(event){
      if (!this._isEventWithOption(event)) return false;

      var eventParts = this._getEventParts(event);
      return _.isKeyEvent(eventParts[0]) && _.isKey(eventParts[1]);
    }

  });

  return Backbone;

});