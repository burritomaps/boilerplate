(function($) {

  window.couch = {};

  couch.defaults = {
    headers: {"Accept":"application/json"},
    dataType:"json",
    contentType: "application/json",
    type: "GET",
    url: "/"
  };  

  couch.request = function(opts) {
    var ajaxOpts = $.extend({}, couch.defaults, opts);
    return $.ajax(ajaxOpts).promise();
  }
  
  couch.get = function(path, opts) {
    if (!opts) opts = {data: {}};
    _.each(_.keys(opts.data), function(k) {
      opts.data[k] = JSON.stringify(opts.data[k]);
    })
    return couch.request($.extend({}, {url: couch.dbPath + path, type: "GET"}, opts));
  }

  couch.db = function(uri) {
    return {
      name: name,
      uri: uri + "/",

      get: function(id) {
        return couch.request({url:this.uri + id, type:"GET"});
      },

      save: function(doc) {
        if (doc._id === undefined) {
          var type = "POST";
          var uri = this.uri;
        } else {
          var type = "PUT";
          var uri = this.uri + encodeURIComponent(doc._id);
        }
        return couch.request({url:uri, type:type, data:JSON.stringify(doc)});
      },

      designDocs: function(opts) {
        return couch.request($.extend(couch.defaults, {
          url: this.uri + "_all_docs",
          data: {startkey:'"_design/"', endkey:'"_design0"', include_docs:true}
        }));
      }

    };
  };

})(jQuery);