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

app.get('/api/hello', outputUserInfo);


app.get('/api/hello', (req, res) => {
    res.send('Hello ' + (req.user.displayName || 'user without a name') + '!');

    console.log('successful authenticated request by ' + req.user.emails[0].value);
});

function getUserEmail(req, res) {
    res.send(req.user.emails[0].value);
    // console.log('validateUser : successful authenticated request by ' + req.user.emails[0].value);
}

// function getUserID(req, res) {
//     console.log(req.user);
//     res.send(req.user.id);
// }

function outputUserInfo(req, res) {
    // console.log("user: "+req.user);
    // console.log("user: "+req.user.emails);
    // console.log("user: "+req.user.email);
    console.log("outputUserInfo called");
    console.log("req in outputUserInfo" + req);
    try {
        console.log(req.user.displayName);
        console.log(req.user.emails[0].value);
        console.log("id" + req.user.id);
        res.send(req.user.displayName);
    } catch (e) {
        console.error("ERROR code : server.js01 : error getting user info: " + e);
    }
}

//Server the web pages such as index.html
app.use('/', express.static('webpages', {
    extensions: ['html']
}));

app.get('/webserver/translateText/', async function(req, res) { //Currently returns an error if no text is passed for translation. TODO Currently relying on client side validation to stop this
    res.setHeader('Content-Type', 'application/json');

    let isFavourite = req.query.isFavourite;
    let textToTranslate = req.query.text;
    let languageToTranslateTo = req.query.languageToTranslateTo;
    //TODO prevent translation if both are auto detect and/or both target and origin languages are the same.
    let originLanguage = req.query.languageToTranslateFrom; //TODO change all languageToTranslateFrom to originLanguage
    let translatedText = await translatorMethods.translateText(textToTranslate, languageToTranslateTo, originLanguage);

    try {
        let userID = req.user.id; //Getting the user ID from the Google Auth token. //TODO use this ID to associate the translation with the user in the database
        if (userID) {
            await databaseMethods.addTranslation(userID, originLanguage, languageToTranslateTo, textToTranslate, translatedText, isFavourite);
        }
    } catch (e) {
        console.error("ERROR code : server.js03 : user not signed in. Not saving translation");
    }
    let toSend = {
        translatedText: translatedText,
        languageTranslatedTo: "placeHolderLanguage"
    };
    res.json(toSend);
});



// let url = '/webserver/getPreviousTranslations?token=' + token;
app.get('/webserver/getPreviousTranslations', async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    let userID = req.user.id; //Getting the user ID from the Google Auth token.
    let response = await databaseMethods.viewAllTranslations(userID);
    res.json(response);
});


/* Code to run the server. This will run indefinetly unless terminated. If an error occurs during startup then this error should be outputted.Otherwise a successful startup should be indicated.The server is run on port 8080 by default. To change this edit the value of the port constant*/
const port = 8080; //TODO maybe pass port as a parameter to the server?
app.listen(port, (err) => {
    if (err) console.error('error starting server: ', err);
    else console.log('easyTranslate server now running.'); //TODO change NameOfOurSiteHere to appropriate.
});
