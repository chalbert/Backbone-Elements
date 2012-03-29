define([
  'jquery',
  'backbone',
  'backbone-elements'
], function($, Backbone){

  describe("$get", function () {

    beforeEach(function(){
      $('body').append('<div id="content"/>');
      var view = Backbone.View.extend({
        el: 'body',
        elements: {
          content: '#content'
        }
      });
      this.view = new view();
    });

    afterEach(function(){
      $('body').remove('#content');
      this.view.destroy();
    });

    it("Returns the jQuery object from an element name.", function () {
      expect(this.view.$get('content')).toBe($('#content'));
    });

  });

});