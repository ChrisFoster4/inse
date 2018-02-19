'use strict'
const translate = require('google-translate-api'); //npmjs.com page for this module https://www.npmjs.com/package/google-translate-api
const utilities = require("./util/utils.js"); //A file containing some helper function for translatingText

/*
 *@params textToTranslate Should be a string.
 *@params originLanguage this parameter is optional as the google translate API can auto detect the language
 *@params targetLanguage the language the user wishes to translate too. This should be selected by the user from a dropdown on the webpage.
 TODO describe below function in detail including error handling
 */

async function translateText(textToTranslate, targetLanguage, originLanguage) {
    let toReturn = "ERROR code : translator.js01 : no result from translation";

    targetLanguage = utilities.userLanguageToISO_Code(targetLanguage);
    originLanguage = utilities.userLanguageToISO_Code(originLanguage);
    if (textToTranslate) {
        await translate(textToTranslate, {
            from: originLanguage,
            to: targetLanguage
        }).then(res => {
            let targetLanguage = (res.from.language.iso);
            toReturn = res.text;
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
