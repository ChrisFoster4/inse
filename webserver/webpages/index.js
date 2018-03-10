console.log("index.js called");

//Binding HTML buttons to their appropriate JavaScript functions
document.getElementById('translateButton').addEventListener('click', submitTextToTranslate);
document.getElementById('logoutButton').addEventListener('click', signOut);

/*
 This function (submitTextToTranslate) should take what the user entered in the inputArea textarea and pass it to the server for translation. The result of the translation should then be put into the outputArea textarea. If the user is signed in then the result of the translation should also be sent to the server to be put into the database.
*/
async function submitTextToTranslate(){
    let userEmail = await callServer();
    console.log("User email= "+userEmail);
    console.log("submitTextToTranslate called");
    let contentsOfTextBox = document.getElementById('inputArea').value; //This is the text that will be translated
    let languageToTranslateTo = getLanguageToTranslateToo();
    let languageToTranslateFrom = getLanguageToTranslateFrom();
    if (contentsOfTextBox) { //Checking that the user has entered text they wish to translate
        const url = '/webserver/translateText?text=' + contentsOfTextBox + "&languageToTranslateTo=" + languageToTranslateTo + "&languageToTranslateFrom=" + languageToTranslateFrom;
        const response = await fetch(url);
        if (response.ok) {
            let jsonResponse = await response.json();
            console.log(jsonResponse);
            console.log(jsonResponse.translatedText);
            document.getElementById('outputArea').value = jsonResponse.translatedText;
            if (userEmail){
                console.log("User is signed in.With ID: " + userEmail);
            }else {
                console.log("User is not signed in");
            }
        } else {
            console.error('error submitting text to translate', response.status, response.statusText);
        }
    } else console.log("The user tried to translate null"); //TODO handle this more elligantly and indicate the error to the user.
}

/*
 This function (getLanguageToTranslateToo) should get the language that is selected in the outputLang dropdown box.
 @return A string containing the language to translate to.
 */
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

/*
 This function (getLanguageToTranslateFrom) should get the language that is selected in the inputLang dropdown box.
 @return A string containing the language to translate from.
 */
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

//Below 2 functions are from Google - https://developers.google.com/identity/sign-in/web/sign-in
/*
 This function (onSignIn) is run whenever a google user presses the signin button and correctly authenticates OR whenever a signed in user loads the page. The function should set a global variable so other functions can check if a user is signed in. The function also logs the users information.
 @params googleUser The Google account being user. This is passed to the function by the Google API
*/
function onSignIn(googleUser) {
  window.userID = googleUser.getBasicProfile().getId();
  var profile = googleUser.getBasicProfile();
  // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // console.log('Name: ' + profile.getName());
  // console.log('Image URL: ' + profile.getImageUrl());
  // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

/*
 This function (signOut) is only ran when the uses presses on the "logout" button.The function should sign out the user and set a global variable to allow other functions to check if the user is signed in.
*/
async function signOut() {
  await gapi.auth2.getAuthInstance().signOut();
    window.userID = undefined;
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
      callServer();
    });
  }

//Bellow two functions are from the manual for the simple-google-openid package avaliable at: //https://www.npmjs.com/package/simple-google-openid
async function callServer() {
  const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token },
  };
  const response = await fetch('/api/hello', fetchOptions);
  if (!response.ok) {
    // handle the error
    console.log("Server error:\n" + response.status);
    return;
  }

  // handle the response
  const data = await response.text();
  // console.log('setting text content: ' + data);
  // console.log(data);
  return data;

}

// react to computer sleeps, get a new token; gapi doesn't do this reliably
// adapted from http://stackoverflow.com/questions/4079115/can-any-desktop-browsers-detect-when-the-computer-resumes-from-sleep/4080174#4080174
(function () {
  const CHECK_DELAY = 2000;
  let lastTime = Date.now();

  setInterval(() => {
    const currentTime = Date.now();
    if (currentTime > (lastTime + CHECK_DELAY*2)) {  // ignore small delays
      gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse();
    }
    lastTime = currentTime;
  }, CHECK_DELAY);
}());
