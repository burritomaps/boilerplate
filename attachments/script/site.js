var app = {
  baseURL: util.getBaseURL(window.location.href),
};

couch.dbPath = app.baseURL + "api/";

/*
  App.routes
    pages (URL routed with SugarSkull)
      home (href === "/#/")
      hey (href === "/#:id")
    events (no URL change triggered)
      error (href === "error/uhoh!" or "error!")
*/

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
  },
  events: {
    error: function(message) {
      messages = {bad: "An error has occurred!"}
      alert(messages[message])
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
  
  // links that end with ! should trigger app.routes.events
  util.catchEvents()
  
  app.router = Router({
    '/': {on: 'home'},
    '/:action': {on: 'hey'}
  }).use({ resource: app.routes.pages }).init('/');

})