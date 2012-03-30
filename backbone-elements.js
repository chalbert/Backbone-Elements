/*!
 * Backbone-Elements
 * (Tested with Backbone 0.9.2)
 *
 * Backbone-Elements is freely distributable under the MIT license.
 *
 * For more details & documentation:
 * https://github.com/chalbert/Backbone-Elements
 *
 */

(function(plugin){

  (typeof define === 'function' && define.amd)
      ? define(['underscore', 'backbone'], plugin)
      : plugin(_, Backbone);

})(function (_, Backbone){

  var initialize = Backbone.View.prototype.initialize;

  _.extend(Backbone.View.prototype, {

    initialize: function(){
      if (this.events) this.events = this.mapEvents(this.events);
      this.refreshElements();
      initialize.apply(this, arguments);
    },

    // Convention based event binding
    mapEvents: function(elements){
      var eventStack = {};
      _.each(elements, function(events, element){
        _.extend(eventStack, this._formatElementEvents(element, events));
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
          key = event + ((selector === '') ? '' : (' ' + selector));

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
    // Remove empty then join with underscore. Replace colon of attribute with underscore
    return _.compact(_.toArray(arguments)).join('_').replace(':', '_');
  }

  return Backbone;


});


