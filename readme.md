# CoucHTML5 (hehehe)

A nice boilerplate couchapp that uses Twitter's bootstrap css, hij1nks' sugarskull client side router, mustache templating, underscore.js and more.

## Installation

This will walk you through getting the couchtml5 app template and dev environment running on your local machine.

Requirements: node.js and CouchDB.

get Couch >= 1.1 and set up an admin user account

create a database for your app to live in

    curl -X PUT http://admin:pass@localhost:5984/some_database
    
make a vhost for this couchapp

    curl -X PUT http://admin:pass@localhost:5984/_config/vhosts/boilerplate -d '"/some_database/_design/boilerplate/_rewrite"'

add or edit the following line to/in your `/etc/hosts` file

    127.0.0.1	localhost boilerplate
    
install node.js v0.4.x (tested against 0.4.8) and npm

    // install node
    git clone clone git://github.com/joyent/node.git
    cd node/
    git checkout v0.4.8
    ./configure && make && make install
    // then install npm
    curl http://npmjs.org/install.sh | sh

install `couchapp` from npm:

    npm install couchapp -g
    
push this couchapp

    couchapp push app.js http://admin:pass@localhost:5984/some_database
    
open it in a browser

    open http://boilerplate:5984