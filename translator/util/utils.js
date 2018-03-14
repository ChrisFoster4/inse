'use strict'
//TODO comment describe below function
function userLanguageToISO_Code(inputString) {
    /** Languages we included  in our SRS questionaire
     English,French,German,Spanish,Italian,Portugese,
     Dutch,Swedish,Norwegian,Polish,Russian,Greek,Arabic,Mandarin Chinese, Japanese

    List of ISO language codes https://www.w3schools.com/tags/ref_language_codes.asp

    We do not need to worry about the user entering the langauge wrong e.g."eglish" as they will be selected from a dropdown and passed to the server from there. TODO is this a bad idea. It is trusting the client to go into the HTML and change dropdown values
    */
    //TODO remove languages that we decide not to support.
    //This list is in the same order as in the HTML page for readability. Keep it this way
    switch (inputString) {
        case "English":
            return "en";
        case "French":
            return "fr";
        case "German":
            return "de";
        case "Spanish":
            return "es";
        case "Italian":
            return "it";
        case "Portugese":
            return "pt";
        case "Dutch":
            return "nl";
        case "Swedish":
            return "sv";
        case "Norwegian":
            return "no";
        case "Polish":
            return "pl";
        case "Russian":
            return "ru";
        case "Greek":
            return "el";
        case "Arabic":
            return "ar";
        case "Japanese":
            return "ja";
        case "Mandarin Chinese":
            return "zh-cn"; //ISO code according to https://en.wikipedia.org/wiki/Mandarin_Chinese
        case "auto":
            return ""; //No language entered. Autodetecting language
        default: // This should NEVER be reached as the input is from a drop down list
            console.log("ERROR code : utils.js01 : Unknown language entered: " + inputString);
            return ("ERROR code : utils.js : Unknown language entered: " + inputString);
    }

}
module.exports.userLanguageToISO_Code = userLanguageToISO_Code;

/**
This function is needed as when the language is autodetect to Google translate API
returns an ISO code(e.g. "es") not a human langage (e.g. "Spanish").
This is the inverse of the userLanguageToISO_Code function.
*/
function isoCodeToHumanLanguage(isoCode) {
    //TODO This function is currently unused however will be used to tell the user which language was autodetected.(Line 5 in README)
    //This list is in the same order as in the HTML page for readability. Keep it this way
    switch (isoCode) {
        case "en":
            return "English";
        case "fr":
            return "French";
        case "de":
            return "German";
        case "es":
            return "Spanish";
        case "it":
            return "Italian";
        case "pt":
            return "Portugese";
        case "nl":
            return "Dutch";
        case "sv":
            return "Swedish";
        case "no":
            return "Norwegian";
        case "pl":
            return "Polish";
        case "ru":
            return "Russian";
        case "el":
            return "Greek";
        case "ar":
            return "Arabic";
        case "ja":
            return "Japanese"
        case "zh-cn":
            return "Mandarin Chinese"
        default:
            console.log("ERROR code : utils.js02 :  Google API returned an unrecgonised ISO code" + isoCode);
            return "Google API returned an unrecgonised ISO code";

            /* If google autodetects a language we don't support i.e Korean then this message should be shown. TODO Could make this work properly using the langs library to convert iso codes or by expanding the case statements in this file.
            Langs library: https://www.npmjs.com/package/langs
			*/
    }
}
module.exports.isoCodeToHumanLanguage = isoCodeToHumanLanguage;
