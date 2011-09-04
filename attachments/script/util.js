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

  function routeViews( route ){
    
    var fullRoute = route;
    
    if( !route.length || route.length === 0 ) {
      app.routes.pages[ 'home' ]();
      return;
    }
    
    route = route.split('/');

    // If we've made it this far, then the ID (if one exists) will be
    // what comes after the first slash, so /action/id
    var id = route[1]
      , action = route[0]
      ;

    // If "#" is in the route, and it's the first char, then we are dealing with
    // a modal, we're going to route it through the views modals object
    if( action.indexOf( '#' ) === 0 ) {

      action = action.replace('#', '');
      app.routes.modals[ action ]( id );

    // Otherwise, it's a page, and we're going to route it through the
    // views pages object, and pushState
    } else {
      console.log(fullRoute)
      history.pushState({}, "", '/' + fullRoute); 
      app.routes.pages[ action ]( id );
      
    }
  }
  
  return {
    capitalize: capitalize,
    isAdminParty: isAdminParty,
    cachedRequest: cachedRequest,
    render: render,
    getBaseURL: getBaseURL,
    routeViews: routeViews
  };
}();