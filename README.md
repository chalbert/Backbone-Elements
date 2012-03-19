# Backbone-Elements

Simplify the way you manage your UI elements within a view.  

**DEPENDENCIES**: [Underscore-Keys](https://github.com/chalbert/Underscore-Keys)
as an optional dependency for key-event. 

Backbone-Elements helps in 2 main ways: 

* Element manipulation
* Event handling

## Element manipulation

Elements are defined in a 'elements' hash consisting of a *name* and a *selector*

    var view = Backbone.View.extend({
      elements: {
        title: 'h2',
        field: '.field',
        list: 'ul',
        rows: 'li'        
      }
    });
    
Later on your view, elements can be accessed in 2 ways:

Just prefix the name of the element with the $. 

    this.$title.text('My title');
    var val = this.$field.val();
    
### Using the *$get()* method 
For dynamic elements generated after the view initialization.

    this.$list.append('li');
    console.log(this.$rows); // No elements returned, as the element is cached before its creation
    console.log(this.$get('rows')); // Works!
    
It's also possible to refresh the cached elements.

    this.$list.append('li');
    this.refreshElements();
    console.log(this.$rows); // Works!
    
If for any reason you need to define elements on the fly, pass the new elements 
as an argument to the *refreshElements()* method.

    this.refreshElements({
      link: 'a',
      button: '.button'
    });
    
##Event handling

Convention based event handling, based on the elements. Remember the traditional Backbone event hash? 

    // Traditional Backbone event hash
    events: {
      'blur a.awesome-link': 'onBlur',
      'click a.awesome-link': 'onClick',
      'mouseover a.awesome-link': 'onOver'     
    }
    
Now events are consolidaded by element, and the selectors are abstracted.

    // New event hash    
    events: {
      link: 'blur click mouseover'
    }
    
Which will be using the convention *elementName_event*.
    
    link_blur: function(){},
    link_click: function(){},
    link_mouseover: function(){}
    
Under the hood, the new hash is converted to the traditional hash, so *delegateEvents()* 
and *undelegateEvents()* are left untouched. You can still pass a traditional hash to *delegateEvents()* if you
so want.

To delegate new events after initialization, use *delegateEvents()* in conjonction with the *mapEvents()* method:

    this.delegateEvents(this.mapEvents({
      title: 'focus click'
    }));
    
Be sure that methods exist for each event you define, or it will 
throw an error such as "Event's method "title_click" does not exist".

###Specific key events

Add events to a specific key. Depends on few Underscore utilities grouped as a lightweight plugin:
[Underscore-Keys](https://github.com/chalbert/Underscore-Keys).

    events: {
      field: 'keypress:enter'
    },
    
    field_keypress_enter: function() {}
    
    

    
    