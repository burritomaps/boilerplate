var util = function() {

  // handy for turning HTML forms into JSON objects
  // e.g. $('form').serializeObject()
  $.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
      if (o[this.name]) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };
  
  // e.g. capitalize("hello world") => "Hello World"
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
  }
  
  // CouchDB specific. True if no admins exist in the database
  function isAdminParty( userCtx ) {
    return userCtx.roles.indexOf("_admin") !== -1;
  }

  function cachedRequest(opts) {
    var dfd = $.Deferred();
    var key = JSON.stringify(opts);
    if (app.cache[key]) {
      dfd.resolve(jQuery.extend(true, {}, app.cache[key]));
    } else {
      var ajaxOpts = $.extend({}, opts);
      $.ajax(ajaxOpts).then(function(data) {
        app.cache[key] = data;
        dfd.resolve(data);
      })
    }
    return dfd.promise();
  }

  // given <script type='text/mustache' class="coolTemplate"> woo {{#message}} </script> 
  // and <div class="awesome"></div> are in the dom
  // render('cool', 'awesome', {message: "hooray"}) will put 'woo hooray' into the div
  // and then call the app.after.cool function if you have defined it
  function render( template, target, options ) {
    if ( !options ) options = {data: {}};
    if ( !options.data ) options = {data: options};
    var html = $.mustache( $( "." + template + "Template:first" ).html(), options.data );
    if (target instanceof jQuery) {
      var targetDom = target;
    } else {
      var targetDom = $( "." + target + ":first" );
    }
    if( options.append ) {
      targetDom.append( html );
    } else {
      targetDom.html( html );
    }
    if (template in app.after) app.after[template]();
  }

  function getBaseURL(path) {
    var url = $.url(path);
    var base = url.attr('base');
    return base + "/";
  }

  function catchEvents( route, event ) {
    
    // Trim off the #/ from the beginning of the route if it exists
    route = route.replace('#/', '');
    
    /*
      Basic rules:
        * If the href ends with a bang (!) we're going to trigger the corresponding event route
        * Otherwise, we're going to pass it through to SugarSkull
    */

    if( route && route.indexOf( '!' ) === ( route.length -1 ) ) {

      route = route.substr(0, route.lastIndexOf('!'));

      // The ID (if one exists) will be what comes after the slash
      var id = route.split('/')[1];

      // If there is an ID, then we have to trim it off the route
      if (id) {
        route = route.split('/')[0];
      }

      if(route in app.routes.events) app.routes.events[ route ](id);

      if (event) event.preventDefault();

    }

  }
  
  return {
    capitalize: capitalize,
    isAdminParty: isAdminParty,
    cachedRequest: cachedRequest,
    render: render,
    getBaseURL: getBaseURL,
    catchEvents: catchEvents
  };
}();