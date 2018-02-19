'use strict'
const express = require('express');
const app = express();
const translatorMethods = require('../translator/translator.js');

app.use('/', express.static('webpages', { //TODO this doesn't work if node is called from a different directory i.e. `node INSE/webserver/server.js`
    extensions: ['html']
}));

app.get('/webserver/translateText/', async function(req, res) { //Currently returns an error if no text is passed for translation. TODO Currently relying on client side validation to stop this
    res.setHeader('Content-Type', 'application/json');
    //TODO prevent translation if both are auto detect and/or both target and origin languages are the same.
    let textToTranslate = req.query.text;
    let languageToTranslateTo = req.query.languageToTranslateTo;
    let originLanguage = req.query.languageToTranslateFrom; //TODO change all languageToTranslateFrom to originLanguage
    let translatedText = await translatorMethods.translateText(textToTranslate, languageToTranslateTo, originLanguage);
    let toSend = {
        translatedText: translatedText,
        languageTranslatedTo: "placeHolderLanguage"
    };
    res.json(toSend);
});

/* Code to run the server. This will run indefinetly unless terminated. If an error occurs during startup then this error should be outputted.Otherwise a successful startup should be indicated.The server is run on port 8080 by default. To change this edit the value of the port constant*/
const port = 8080;
app.listen(port, (err) => {
    if (err) console.error('error starting server: ', err);
    else console.log('easyTranslate server now running.'); //TODO change NameOfOurSiteHere to appropriate.
});
