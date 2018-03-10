'use strict'
const GoogleAuth = require('simple-google-openid');
const mysql = require('mysql2/promise');
const express = require('express');
const app = express();
const translatorMethods = require('../translator/translator.js');
const databaseMethods = require('../database/databaseMethods.js');


//Required for server side authentication of the Google user.
let googleClientID = "699486973238-qtkkm8tofnsnhidhvnhjm26efnvgs107.apps.googleusercontent.com";
app.use(GoogleAuth(googleClientID));


// return 'Not authorized' if we don't have a user
app.use('/api', GoogleAuth.guardMiddleware());

app.get('/api/hello', getUserEmail);


function getUserEmail(req, res) {
    res.send(req.user.emails[0].value);
    // console.log('validateUser : successful authenticated request by ' + req.user.emails[0].value);
}

function getUserID(req, res) {
    res.send(req.user.id[0].value);
}

function getUserDisplayName() {
    res.send(req.user.displayName[0].value);
}

//Server the web pages such as index.html
app.use('/', express.static('webpages', {
    extensions: ['html']
}));

app.get('/webserver/translateText/', async function(req, res) { //Currently returns an error if no text is passed for translation. TODO Currently relying on client side validation to stop this
    res.setHeader('Content-Type', 'application/json');
    let usersID = getUserID(req,res); //TODO use this ID to associate the translation with the user in the database
    let textToTranslate = req.query.text;
    let languageToTranslateTo = req.query.languageToTranslateTo;
    //TODO prevent translation if both are auto detect and/or both target and origin languages are the same.
    let originLanguage = req.query.languageToTranslateFrom; //TODO change all languageToTranslateFrom to originLanguage
    let translatedText = await translatorMethods.translateText(textToTranslate, languageToTranslateTo, originLanguage);
    let toSend = {
        translatedText: translatedText,
        languageTranslatedTo: "placeHolderLanguage"
    };
    res.json(toSend);
});

/* Code to run the server. This will run indefinetly unless terminated. If an error occurs during startup then this error should be outputted.Otherwise a successful startup should be indicated.The server is run on port 8080 by default. To change this edit the value of the port constant*/
const port = 8080; //TODO maybe pass port as a parameter to the server?
app.listen(port, (err) => {
    if (err) console.error('error starting server: ', err);
    else console.log('easyTranslate server now running.'); //TODO change NameOfOurSiteHere to appropriate.
});
