var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = 
  { _id:'_design/boilerplate'
  , rewrites: 
    [ {from:"/", to:'index.html'}
    , {from:"/api", to:'/../../'}    
    , {from:"/api/*", to:'/../../*'}
    , {from:"/:action", to:'index.html'}
    , {from:"/:action/:id", to:'index.html'}
    , {from:"/*", to:'*'}
    ]
  }
  ;

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;