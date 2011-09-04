var app = {
  baseURL: util.getBaseURL(window.location.href),
};

couch.dbPath = app.baseURL + "api/";

// some default routes. these can be customized by editing the util.routeViews function
app.routes = {
  pages: {
    // code to be executed when users visit the root route of this couchapp ('/')
    home: function() {
      util.render('welcome', 'hero-unit', {random: Math.random()})
      util.render('columns', 'row')
      util.render('nav', 'navContainer')
    },
    // when users visit routes like '/somewhere', this route will get called with id === 'somewhere'
    hey: function(id) {
      if(id) alert(id)
    }
  }
}

// These are called after every corresponding util.render
// e.g. util.render('userPosts', 'centerColumn') will call app.after.userPosts() after rendering
app.after = {
  welcome: function() {
    $('.btn').click(function(){ $('.hero-unit').css('background-color', 'salmon') });
  }
}


$(function() {  
  // set the route as the pathname, but loose the leading slash
  var route = window.location.pathname.replace('/', '');

  util.routeViews( route );
  
  $('a').live('click', function( event ) {
    /*
      Basic rules of this router:
        We are going to let the following types of hrefs through
         * links off domain (contains http://)
         * point to elements in app.reservedKeywords through
         
        If it's not one of these things, then we are going to prevent default and
          * If there is a hash in the href, we're going to launch a modal
          * Otherwise, we're going to pushState and render a page view
    */
    
    var route = $(this).attr('href')

    // If "http://" is in the route, we're going to let it through, and this function is over
    if( !route || route.indexOf( 'http://' ) > -1) {
      return;
    }

    // If the route contains one of our reserved pages, let it through
    if( route.split('/')[0].indexOf(app.reservedPages) > -1){
      return;
    }

    // If it's not off tld or if it's not going to start with a reserved page,
    // then we're going to prevent default and handle everything with javascript
    event.preventDefault();
    util.routeViews( route )
  });
  
  $(window).bind('popstate', function() {
  
    event.preventDefault();
  
    util.routeViews( $.url(window.location.pathname).segment()[0] );
  });
})