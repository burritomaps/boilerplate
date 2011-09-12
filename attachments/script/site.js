var app = {
  baseURL: util.getBaseURL(window.location.href),
}

couch.dbPath = app.baseURL + "api/"

/*
  App.routes
    pages (URL routed with SugarSkull)
      home (href === "/#/")
      hey (href === "/#:id")
    events (hrefs ending with !. no URL change triggered)
      error (href === "/#/error/uhoh!" or "/#/error!")
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
    action: function(id) {
      if(id) alert(id)
    }
  },
  events: {
    error: function() {
      alert("An error has occurred!")
    }
  }
}

// These are called after every corresponding util.render
// e.g. util.render('userPosts', 'centerColumn') will call app.after.userPosts() after rendering
app.after = {
  welcome: function() {
    $('.btn').click(function(){ $('.hero-unit').css('background-color', 'salmon') })
  }
}


$(function() {
  
  // links that end with ! should trigger app.routes.events
  $('a').live('click', function(event) {
    var route =  $(this).attr('href')
    if (route) util.catchEvents(route, event)
  })
  
  app.router = Router({
    '/': {on: 'home'},
    '/(\\w+)!': {on: function(modal) { util.catchEvents("#/" + modal + "!") }},
    '/:action': {on: 'action'},
  }).use({ resource: app.routes.pages }).init('/')
  
})