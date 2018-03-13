'use strict'
const translate = require('google-translate-api'); //npmjs.com page for this module https://www.npmjs.com/package/google-translate-api
const utilities = require("./util/utils.js"); //A file containing some helper function for translatingText

/*
  This function (translateText) should translate the passed text using the google translate api by turning the target/origin language to their corresponding ISO codes.
  The translated text can then be passed back to the server. Errors when no text is passed and on unexpected errors during translation

 *@params textToTranslate the string of text the user is trying to translate
 *@params originLanguage the language the text should be translated from - optional as google translate API can auto detect the language
 *@params targetLanguage the language the text should be translated to - Should be selected by the user from a dropdown on the webpage.
 *@return toReturn the translated text obtained from the translate function from google api

 */
async function translateText(textToTranslate, targetLanguage, originLanguage) {
    let placeHolderResponse = "ERROR code : translator.js01 : no result from translation";
    let toReturn = {text : placeHolderResponse,
                    originLanguage: "auto",
                    targetLanguage: "auto"
                    }

    // get the target/origin languages corresponding ISO codes
    targetLanguage = utilities.userLanguageToISO_Code(targetLanguage);
    originLanguage = utilities.userLanguageToISO_Code(originLanguage);
    if (textToTranslate) { // checking the text to translate isn't null
        await translate(textToTranslate, {
            from: originLanguage,
            to: targetLanguage
        }).then(res => {
            let targetLanguage = (res.from.language.iso);
            toReturn.targetLanguage = targetLanguage;
            toReturn.text = res.text;
            return toReturn;
        }).catch(err => {
            console.error("ERROR code: translator.js03 : Error during translation : "+err);
            return toReturn;
        });
    } else {
        return ("ERROR code : translator.js02 : No text passed to be translated"); //This should not happen as it is disallowed by the index.js however the user could edit this.
    }
    return toReturn;
}
module.exports.translateText = translateText;
