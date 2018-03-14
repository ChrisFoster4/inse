'use strict'
const translatorMethods = require('../translator/translator.js');
const databaseMethods = require('../database/databaseMethods.js');
const GoogleAuth = require('simple-google-openid');
const express = require('express');
const app = express();


//Required for server side authentication of the Google user.
let googleClientID = "699486973238-qtkkm8tofnsnhidhvnhjm26efnvgs107.apps.googleusercontent.com";
app.use(GoogleAuth(googleClientID));

// return 'Not authorized' if we don't have a user
app.use('/api', GoogleAuth.guardMiddleware());
app.get('/api/hello', outputUserInfo);

//Serve the web pages such as index.html
app.use('/', express.static('webpages', {
    extensions: ['html']
}));


/**
 This function (outputUserInfo) should get the users attributes from the request and output them.
 If the users data cannot be obtained an error should be thrown.
 @params req The request from the user's client
 @params res The response that will be sent to the server
 */
function outputUserInfo(req, res) {
    try {
        console.log(req.user.displayName);
        console.log(req.user.emails[0].value);
        console.log("id" + req.user.id);
        res.send(req.user.displayName);
    } catch (e) {
        console.error("ERROR code : server.js01 : error getting user info: " + e);
    }
}

/**
 This function should accept requests for the path "/webserver/translateText". The request SHOULD include 4 parameter explained below.
 If ANY of these are missing an error should be thrown.
 @params req.query.isFavourite boolean If the translation about to be done or not is to be stored as a favourite.
 @params req.query.textToTranslate string The text that shall be passed to the translation module
 @params req.query.languageToTranslateTo The language that the user wishes to translate to
 @params req.query.languageToTranslateFrom The language that is being translated from.
 @return  res JSON object The response(res) should contain the translated text, the language translated to in NON iso code form and the language translated from in NON iso code form
*/
app.get('/webserver/translateText/', async function(req, res) { //Currently returns an error if no text is passed for translation. TODO Currently relying on client side validation to stop this
    res.setHeader('Content-Type', 'application/json');

    //Can't use try catch here as it makes the varibles local scope to the try block. Weird.
        let textToTranslate = req.query.text;
        let isFavourite = req.query.isFavourite;
        let languageToTranslateTo = req.query.languageToTranslateTo;
        let originLanguage = req.query.languageToTranslateFrom;
    if (textToTranslate == undefined || isFavourite == undefined || languageToTranslateTo == undefined || originLanguage == undefined){
        console.error("ERROR code : server.js04 : no value for a parameter.");
    }

    let response = await translatorMethods.translateText("asd", languageToTranslateTo, originLanguage);
    let translatedText = response.text;
    let languageTranslatedFrom = response.originLanguage;

    //The API only returns the language translated from so to get the language translate too we have to translate the result of the previous translation. //TODO find a way around this.
    let secondResponse = await translatorMethods.translateText(translatedText, "auto", "auto");
    let languageTranslatedTo = secondResponse.originLanguage;

    try {
        let userID = req.user.id; //Getting the user ID from the Google Auth token. //TODO use this ID to associate the translation with the user in the database
        if (userID) {
            await databaseMethods.addTranslation(userID, languageTranslatedFrom, languageTranslatedTo, textToTranslate, translatedText, isFavourite);
        }
    } catch (e) {
        console.error("ERROR code : server.js03 : user not signed in. Not saving translation");
    }
    let toSend = {
        translatedText: translatedText,
        languageTranslatedFrom: languageTranslatedFrom,
        languageTranslatedTo: languageTranslatedTo
    };
    res.json(toSend);
});

/**
 This function should accept requests from the path "/webserver/getPreviousTranslations".
 @params req.query.id int the userID who's translation are to be retrieved
 @return res JSON object One row per translation they have done.
*/
app.get('/webserver/getPreviousTranslations', async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    try {
        let userID = req.user.id; //Getting the user ID from the Google Auth token.
        if (userID) {
            let response = await databaseMethods.viewAllTranslations(userID)
            res.json(response);
        } else {
            let response = {};
            res.json(response);
        };
    } catch (e) {
        error(res, e);
    };
});

//Small function to output a 404 error if an unknown path is accessed.
function error(res, msg) {
    res.sendStatus(404)
    console.error(msg)
}

/** Code to run the server. This will run indefinetly unless terminated. If an error occurs during startup then this error should be outputted.Otherwise a successful startup should be indicated.The server is run on port 8080 by default. To change this edit the value of the port constant*/
const port = 8080; //TODO maybe pass port as a parameter to the server?
app.listen(port, (err) => {
    if (err) console.error('Error starting server: ', err);
    else console.log('easyTranslate server now running.'); //TODO change NameOfOurSiteHere to appropriate.
});

module.exports = app
