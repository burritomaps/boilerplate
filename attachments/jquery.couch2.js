(function($) {

  window.couch = {};
  
  couch.defaults = {
    dataType:"json",
    contentType: "application/json",
    type: "GET"
  };
  
  var request = function(options) {
    if (options.doc) var cached = storage.get(options.doc._id);
    if (cached) {
      var dfd = $.Deferred();
      dfd.resolve(jQuery.extend(true, {}, cached));
      return dfd.promise();
    } else {
      var ajaxOpts = $.extend({}, couch.defaults, options);
      ajaxOpts.dataFilter = function (data) {
        storage.post(JSON.parse(data));
        return data;
      };
      return $.ajax(ajaxOpts).promise();
    }
  }

  // set up an in-memory storage shim
  var storage = {
    data: { 
      set: function(key, value) {
        return storage.data.cache[key] = value;        
      },
      get: function(key) {
        return storage.data.cache[key];
      },
      remove: function(key) {
        return delete storage.data.cache[key];
      },
      cache: {}
    },
    get: function (_id, options) {
      return storage.data.get(_id);
    },
    post: function (doc, options) { 
      return storage.data.set(doc._id, doc);
    },
    remove: function (doc, options) {
      return storage.data.remove(doc._id);
    }
  }
  
  // progressively enhance for persistence
  if ( Modernizr.indexeddb ) {
    // TODO better handle asynchronicity of this function
    storage = false;
    createCouch( 
      { name: "couchtml5"
      , success: function (newCouch) { storage = newCouch; }
      , error: function (error) { console.error(error); }
    })
  } else if ( Modernizr.localstorage ) {
    // from http://stackoverflow.com/posts/4762411/revisions
    storage.data = {
      set: function(key, value) {
        if (typeof value == "object") {
          value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
      },
      get: function(key) {
        var value = localStorage.getItem(key);
        // assume it is an object that has been stringified
        if (value[0] == "{") {
          value = JSON.parse(value);
        }

        return value;
      }
    }
  }

  // vhosts are when you mask couchapps behind a pretty URL
  var inVhost = function() {
    var vhost = false;
    if ( document.location.pathname.indexOf( "_design" ) === -1 ) {
      vhost = true;
    }
    return vhost;
  }
  
  if ( inVhost() ) {
    $.extend(couch.defaults, {
      // these need to be defined in rewrites.json
      couch: "couch", // requires secure_rewrites = false
      db: "api",
      design: "ddoc",
      host: document.location.href.split( "/" )[ 2 ]
    })
  } else {    
    var db = document.location.href.split( '/' )[ 3 ],
        ddoc = unescape( document.location.href ).split( '/' )[ 5 ];
    $.extend(couch.defaults, {
      vhost: false,
      couch: "/",
      db: db,
      design: ddoc,
      host: document.location.href.split( "/" )[ 2 ]
    })
  }

  couch.clearStorage = function() {
    storage.data = {};
  };
  
  couch.root = function() {
    // TODO https handling
    return "http://" + couch.defaults.host + couch.defaults.couch;      
  }

  couch.allDbs = function() {
    return request($.extend({}, couch.defaults, {
      uri: "_all_dbs"
    }));
  };

  couch.db = function(name) {
    return {
      name: name,
      get: function(id) {
        return request({uri: id, type: "GET"});
      },
      
      getAttachment: function(id) {
        var opts = {
          uri: id,
          type: "GET",
          contentType: "application/x-www-form-urlencoded",
          dataType: null
        }
        return $.ajax($.extend({}, couch.defaults, opts)).promise();
      },
      
      get: function(uri) {
        return request({uri: uri, type:'GET'});
      },

      put: function(id, data) {
        return request({uri: id, type: "PUT", data: data});
      },

      designDocs: function() {
        return request($.extend({}, couch.defaults, {
          uri: "_all_docs",
          data: {startkey: '"_design/"', endkey: '"_design0"', include_docs: true}
        }));
      }
    };
  };

})(jQuery);