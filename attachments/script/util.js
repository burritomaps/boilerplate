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
    // construct correct URL in and out of couchdb vhosts, e.g. http://awesome.com vs. http://localhost:5984/datacouch/_design/datacouch/_rewrite
    if (url.attr('path').indexOf("_rewrite") > 0) base = base + url.attr('path').split('_rewrite')[0] + "_rewrite";
    return base + "/";
  }

  function catchEvents() {
    $('a').live('click', function( event ) {
      /*
        Basic rules of this router:
          * If the href ends with a bang (!) we're going to trigger an event from app.routes.events
          * Otherwise, we're going to pass it through to SugarSkull
      */

      var route =  $(this).attr('href');

      if( route && route.indexOf( '!' ) === ( route.length -1 ) ) {

        route = route.substr(0, route.lastIndexOf('!'))

        // The ID (if one exists) will be what comes after the slash
        var id = route.split('/')[1];

        // If there is an Id, then we have to trim it off the route
        if(id) {
          route = route.split('/')[0];
        }

        if(route in app.routes.events) app.routes.events[ route ](id);

        event.preventDefault();

      }

    });
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