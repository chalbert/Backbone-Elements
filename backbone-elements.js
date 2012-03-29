define([
  'underscore',
  'backbone'
], function(_, Backbone) {

  var initialize = Backbone.View.initialize;
  Backbone.View.prototype.initialize = function(){
    if (this.events) this.events = this.mapEvents(this.events);
    this.refreshElements();
    initialize.apply(this, arguments);
  }

  _.extend(Backbone.View.prototype, {

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
    refreshElements: function(elements){
      elements = elements || this.elements;
      for (var element in elements) {
        this['$' + element] = $(this.el).find(this.elements[element]);
      }
    },

    isElement: function(element){
      if (element === '') return true;
      return (this.elements) && (this.elements[element]);
    },

    _formatElementEvents: function(element, eventString){
      this._ensureElementExist(element);
      var events = eventString.split(' '),
          eventStack = {};

      _.each(events, function(event, index){

        this._pushFormattedEvent(eventStack, element, event);

      }, this);

      return eventStack;
    },

    _pushFormattedEvent: function(stack, element, event){
      var selector = this._getElementSelector(element),
          key = event + (selector === '') ? '' : ' ' + selector;

      stack[key] = _getEventMethod(element, event);
      return stack;
    },

    _getElementSelector: function(element){
      return (element === '')
          ? ''
          : this.elements[element];
    },

    _ensureElementExist: function(element){
      if (!this.isElement(element)) {
        throw "Element '" + element + "' does not exist.";
      }
    }

  });

  //|---------|
  //| HELPERS |
  //|---------|

  function _getEventMethod(){
    return _.toArray(arguments).join('_');
  }

  return Backbone;

});