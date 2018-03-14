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
            console.log(jsonResponse);
            return (jsonResponse);
        } else {
            console.error("Error getting previous translations");
        }
    }
}

//TODO make this fun when the page is loaded
async function populateColumns() {
    let originTextColumn = document.querySelector(".originText");
    let translatedTextColumn = document.querySelector(".translatedText");
    let originLanguageColumn = document.querySelector(".originLanguage");
    let languageTranslatedToColumn = document.querySelector(".languageTranslatedTo");
    let listOfTranslations = await getPreviousTranslations();
    for (translation in listOfTranslations) {
        console.log(listOfTranslations[translation]);
        originTextColumn.innerHTML = originTextColumn.innerHTML + '<div>'+ listOfTranslations[translation].originText +' </div>'
        translatedTextColumn.innerHTML = translatedTextColumn.innerHTML + '<div>'+ listOfTranslations[translation].targetText +' </div>'
        originLanguageColumn.innerHTML = originLanguageColumn.innerHTML + '<div>' + listOfTranslations[translation].originLanguage + '</div>'
        languageTranslatedToColumn.innerHTML = languageTranslatedToColumn.innerHTML + '<div>' + listOfTranslations[translation].targetLanguage + '</div>'


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
