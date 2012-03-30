define([
  'jquery',
  'underscore',
  'backbone',
  'backbone-elements'
], function($, _, Backbone){

  describe("Backbone-Elements", function () {

    beforeEach(function(){
      $('body').append('<div id="container"><div id="content"><a></a><div class="box"></div></div></div>');
      var view = Backbone.View.extend({
        el: '#container',
        elements: {
          content: '#content'
        }
      });
      this.view = new view();
    });

    afterEach(function(){
      $('body #content').remove();
      this.view.remove();
    });

    describe("$get()", function () {

      it("Returns the jQuery object from an element name.", function () {
        expect(this.view.$get('content')).toBe($('#container').find('#content'));
        expect(this.view.$get('link')).toBe($('#container').find('a'));
        expect(this.view.$get('box')).toBe($('#container').find('.box'));
      });

    });

    describe("refreshElements()", function () {

      it("Should create a cached version for each element", function () {

        _.extend(this.view.elements, {
          link: 'a',
          box: '.box'
        });

        this.view.refreshElements();

        expect(this.view.$content).toBe(this.view.$get('content'));
        expect(this.view.$link).toBe(this.view.$get('link'));
        expect(this.view.$box).toBe(this.view.$get('box'));
      });

    });

  });


});