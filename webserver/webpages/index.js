console.log("index.js called");

document.getElementById('translateButton').addEventListener('click', submitTextToTranslate);

async function submitTextToTranslate(){
    console.log("submitTextToTranslate called");
    let contentsOfTextBox = "hi"; // TODO make this get text that the user entered.
    let languageToTranslateTo = getLanguageToTranslateToo();
    let languageToTranslateFrom = getLanguageToTranslateFrom();
    if (contentsOfTextBox) { //Checking that the user has entered text they wish to translate
        const url = '/webserver/translateText?text=' + contentsOfTextBox + "&languageToTranslateTo=" + languageToTranslateTo + "&languageToTranslateFrom=" + languageToTranslateFrom;
        const response = await fetch(url);
        if (response.ok) {
            let jsonResponse = await response.json();
            console.log(jsonResponse.translatedText);
        } else {
            console.error('error submitting text to translate', response.status, response.statusText);
        }
    } else console.log("The user tried to translate null"); //TODO handle this more elligantly
}

function getLanguageToTranslateToo(){
    //TODO make this function get the selected option from dropdown list
    return "Spanish";
}

function getLanguageToTranslateFrom(){
    //TODO make this function get the selected option from dropdown list
    return "English";
}
