'use strict'
const express = require('express');
const app = express();

app.use('/', express.static('webpages', { //TODO this doesn't work if node is called from a different directory i.e. `node INSE/webserver/server.js`
    extensions: ['html']
}));


/* Code to run the server. This will run indefinetly unless terminated. If an error occurs during startup then this error should be outputted.Otherwise a successful startup should be indicated.The server is run on port 8080 by default. To change this edit the value of the port constant*/
const port = 8080;
app.listen(port, (err) => {
    if (err) console.error('error starting server: ', err);
    else console.log('easyTranslate server now running.'); //TODO change NameOfOurSiteHere to appropriate.
});
