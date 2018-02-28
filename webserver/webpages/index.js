console.log("index.js called");

document.getElementById('translateButton').addEventListener('click', submitTextToTranslate);

async function submitTextToTranslate(){
    console.log("submitTextToTranslate called");
    let contentsOfTextBox = document.getElementById('inputArea').value; //This is the text that will be translated
    let languageToTranslateTo = getLanguageToTranslateToo();
    let languageToTranslateFrom = getLanguageToTranslateFrom();
    if (contentsOfTextBox) { //Checking that the user has entered text they wish to translate
        const url = '/webserver/translateText?text=' + contentsOfTextBox + "&languageToTranslateTo=" + languageToTranslateTo + "&languageToTranslateFrom=" + languageToTranslateFrom;
        const response = await fetch(url);
        if (response.ok) {
            let jsonResponse = await response.json();
            console.log(jsonResponse.translatedText);
            document.getElementById('outputArea').value = jsonResponse.translatedText;
        } else {
            console.error('error submitting text to translate', response.status, response.statusText);
        }
    } else console.log("The user tried to translate null"); //TODO handle this more elligantly
}

function getLanguageToTranslateToo(){
        console.log("getLanguageToTranslateToo called");
    let listOfTargetLanguages = document.getElementById('outputLang');
    let indexOfSelectedTargetLanguage = listOfTargetLanguages.selectedIndex;
    if (indexOfSelectedTargetLanguage == 1) {
        console.log("auto");
        return "auto";
    } else {
        let languageToTranslateTo = listOfTargetLanguages.options[listOfTargetLanguages.selectedIndex].text;
        console.log("outputLang: "+ languageToTranslateTo)
        return languageToTranslateTo;
    }
}

function getLanguageToTranslateFrom() {
    let listOfOriginLanguages = document.getElementById('inputLang');
    let indexOfSelectedOriginLanguage = listOfOriginLanguages.selectedIndex;
    if (indexOfSelectedOriginLanguage == 1) { //If autodetecting the language
        console.log("auto");
        return "auto";
    } else {
        let languageToTranslateFrom = listOfOriginLanguages.options[listOfOriginLanguages.selectedIndex].text;
        console.log("inputLang: "+ languageToTranslateFrom);
        return languageToTranslateFrom;
    }
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}
