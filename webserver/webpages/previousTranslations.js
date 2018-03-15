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
