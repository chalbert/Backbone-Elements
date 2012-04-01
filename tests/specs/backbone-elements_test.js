define([
  'jquery',
  'underscore',
  'backbone',
  'backbone-elements'
], function($, _, Backbone){
  'use strict';

  describe("Backbone-Elements", function () {
    
    var view;
    beforeEach(function(){
      $('body').append('<div id="container"><div id="content"><a></a><div class="box"></div></div></div>');
      var View = Backbone.View.extend({
        el: '#container',
        elements: {
          content: '#content'
        },
        events: {
          content: 'click blur'
        },
        content_click: function(){},
        content_blur: function(){}
      });
      view = new View();
    });

    afterEach(function(){
      $('body #container').remove();
      view.remove();
    });

    /**
     * @behaviors
     */

    it("Should remove the element-based events", function () {
      expect(view.events.content).toBeUndefined();
    });

    //----------------------------------------------------------------

    /**
     *  @method $get()
     */

    describe("$get()", function () {

      it("Returns the jQuery object from an element name.", function () {
        expect(view.$get('content')).toBe($('#container').find('#content'));
      });

      it("It should throw an error if trying to access an undefined element", function () {
        expect(function(){
          view.$get('undefinedElement');
        }).toThrow();

        expect(function(){
          view.$get('content');
        }).not.toThrow();

      });

    });

    /**
     *  @method refresElements()
     */

    describe("refreshElements()", function () {

      var previousElements, newElements;
      beforeEach(function(){
        previousElements = view.elements;
        newElements = {
          link: 'a',
          box: '.box'
        };
        view.refreshElements(newElements);
      });

      it("Should create a cached version of the elements", function () {
        expect(view.$box).toBe(view.$get('box'));
      });

      it("Should use the elements passed as argument to extend existing hash", function () {
        expect(view.elements).toBe(_.extend(previousElements, previousElements));
      });

      it("Should update the pre-existing cached object", function () {
        // Duplicate the element
        view.$box.after(view.$box.clone());
        expect(view.$box.length).not.toBe($('#container').find('.box').length);
        view.refreshElements();
        expect(view.$box.length).toBe($('#container').find('.box').length);

      });

    });

    /**
     *  @method refresElements()
     */

    describe("isElement()", function () {

      it("Should return 'true' if the element exist", function () {
        expect(view.isElement('content')).toBeTruthy();
      });

      it("Should return 'false' if the element doesn't exist", function () {
        expect(view.isElement('imNotAnElement')).not.toBeTruthy();
      });

    });

    /**
     *  @method formatElementEvents()
     */

    describe("formatElementEvents()", function () {

      describe("If the element is defined", function () {

        var events;
        beforeEach(function(){
          events = view.formatElementEvents('content', 'click focus blur');
        });

        it("Should return a hash with a property for each event", function () {
          expect(events['click #content']).toBeTruthy();
          expect(events['focus #content']).toBeTruthy();
          expect(events['blur #content']).toBeTruthy();
        });

        it("It should generate the name of the method following the convention", function () {
          expect(events['click #content']).toBe('content_click');
          expect(events['focus #content']).toBe('content_focus');
          expect(events['blur #content']).toBe('content_blur');
        });

      });


      describe("If the element is not defined", function () {

        var events;
        beforeEach(function(){
          events = view.formatElementEvents('', 'click focus blur');
        });

        it("Should return a hash with a property for each event", function () {
          expect(events.click).toBeTruthy();
          expect(events.focus).toBeTruthy();
          expect(events.blur).toBeTruthy();
        });

        it("It should generate the name of the method following the convention", function () {
          expect(events.click).toBe('click');
          expect(events.focus).toBe('focus');
          expect(events.blur).toBe('blur');
        });

      });

      describe("If the event has attributes", function () {

        it("Should include the attributes in the method name", function () {
          var events = view.formatElementEvents('content', 'click:attr1 focus:attr2 blur:attr3');
          expect(events['click:attr1 #content']).toBe('content_click_attr1');
          expect(events['focus:attr2 #content']).toBe('content_focus_attr2');
          expect(events['blur:attr3 #content']).toBe('content_blur_attr3');
        });

      });

    });

      /**
       *  @method getElementSelector()
       */

      describe("getElementSelector()", function () {

        it("Should return the selector if the element is set", function () {
          expect(view.getElementSelector('content')).toBe('#content');
        });

        it("Should return an empty string if the element is an empty string", function () {
          expect(view.getElementSelector('')).toBe('');
        });

      });

  });


});