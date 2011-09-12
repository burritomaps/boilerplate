var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = 
  { _id:'_design/boilerplate'
  , rewrites: 
    [ {from:"/", to:'index.html'}
    , {from:"/api", to:'../../'}    
    , {from:"/api/*", to:'../../*'}
    , {from:"/script", to:'/script'}
    , {from:"/script/*", to:'/script/*'}
    , {from:"/style", to:'/style'}
    , {from:"/style/*", to:'/style/*'}
    , {from:"/images", to:'/images'}
    , {from:"/images/*", to:'/images/*'}
    , {from:"/:action", to:'index.html'}
    , {from:"/:action/:id", to:'index.html'}
    , {from:"/*", to:'*'}
    ]
  }
  ;

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;