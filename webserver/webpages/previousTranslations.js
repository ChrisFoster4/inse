document.getElementById('logOutButton').addEventListener('click', signOut);
async function getPreviousTranslations() {
    const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token; //Getting the token of the currently logged in user which is sdpassed to the server.
    if (token) {
        const fetchOptions = {
            credentials: 'same-origin',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
        };
        let url = '/webserver/getPreviousTranslations?token=' + token;
        const response = await fetch(url, fetchOptions);
        if (response.ok) {

            let jsonResponse = await response.json();
            return (jsonResponse);
        } else {
            console.error("Error getting previous translations");
        }
    }
}
document.getElementById('favouritesDropdown').addEventListener('change', populateColumns);

function getFavouriteDropdown() {
    let dropdown = document.getElementById('favouritesDropdown');
    let selected = dropdown.selectedIndex;
    if (selected == 0 || selected == 1) return "all";
    if (selected == 2) return "fav only";
    if (selected == 3) return "non fav only";
}

//TODO make this fun when the page is loaded
async function populateColumns() {
    let favourite = getFavouriteDropdown();
    let originTextColumn = document.querySelector(".originText");
    let translatedTextColumn = document.querySelector(".translatedText");
    let originLanguageColumn = document.querySelector(".originLanguage");
    let languageTranslatedToColumn = document.querySelector(".languageTranslatedTo");
    //Clearing columns of existing contents
    originTextColumn.innerHTML = "";
    translatedTextColumn.innerHTML = "";
    originLanguageColumn.innerHTML = "";
    languageTranslatedToColumn.innerHTML = "";

    let listOfTranslations = await getPreviousTranslations();
    for (translation in listOfTranslations) {
        isFavourite = listOfTranslations[translation].isFavourite;
        if (favourite == "all" || (favourite == "fav only" && isFavourite == 1) || (favourite == "non fav only" && isFavourite == 0)) {
            originTextColumn.innerHTML = originTextColumn.innerHTML + '<div>' + listOfTranslations[translation].originText + ' </div>'
            translatedTextColumn.innerHTML = translatedTextColumn.innerHTML + '<div>' + listOfTranslations[translation].targetText + ' </div>'
            originLanguageColumn.innerHTML = originLanguageColumn.innerHTML + '<div>' + listOfTranslations[translation].originLanguage + '</div>'
            languageTranslatedToColumn.innerHTML = languageTranslatedToColumn.innerHTML + '<div>' + listOfTranslations[translation].targetLanguage + '</div>'

        }
    }
}



//Below 2 functions are from Google - https://developers.google.com/identity/sign-in/web/sign-in
/**
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
    document.getElementById('logOutButton').style.visibility = "visible";
    populateColumns();
}

/**
 This function (signOut) is only ran when the uses presses on the "logout" button.The function should sign out the user and set a global variable to allow other functions to check if the user is signed in.
*/
async function signOut() {
    console.log("Signing user out");
    await gapi.auth2.getAuthInstance().signOut();
    window.userID = undefined;
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log('User signed out.');
    });
    clearColumns();

    document.getElementById('logOutButton').style.visibility = "hidden";
}


/*
 This function (clearColumns) sets the contents of the columns on the previousTranslations page
 to be nothing.
*/
function clearColumns(){
    document.querySelector('.originText').innerHTML = "";
    document.querySelector('.translatedText').innerHTML = "";
    document.querySelector('.originLanguage').innerHTML = "";
    document.querySelector('.languageTranslatedTo').innerHTML = "";
}

(function() {
    const CHECK_DELAY = 2000;
    let lastTime = Date.now();
    setInterval(() => {
        const currentTime = Date.now();
        if (currentTime > (lastTime + CHECK_DELAY * 2)) { // ignore small delays
            gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse();
        }
        lastTime = currentTime;
    }, CHECK_DELAY);
}());

setTimeout(populateColumns, 1000);
