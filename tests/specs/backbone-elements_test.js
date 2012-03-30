define([
  'jquery',
  'backbone',
  'backbone-elements'
], function($, Backbone){

  describe("$get", function () {

    beforeEach(function(){
      $('body').append('<div id="container"><div id="content"></div></div>');
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

    it("Returns the jQuery object from an element name.", function () {
      expect(this.view.$get('content')).toBe($('#content'));
    });

  });



});