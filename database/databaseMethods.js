//Importing required libraries
const mysql = require('mysql2/promise');
const sha256 = require('sha256');

const config = require('./config.json'); //Pull in a file containing the database name, host of the database, username to use and the password to use.


/*
  This function (connectionTester) checks that a connection can be made to the database. If the connection fails it should stop the entire server(Not just exit the function).This function should be called at the bottom of the file so when the server starts it checks that the database is reachable.
*/
async function connectionTester() {
    try {
        const sql = await init();
    } catch (e) {
        console.log("ERROR code : databaseMethods.js01 : Could not connect to database. Exiting program now.");
        process.exit(1);
    }
}

/*
 This function (addTranslation) should insert a new translation into the database.
 @params userID the identification number of the user
 @params originLanguage the language the text was translated from
 @params targetLanguage the language the text was translated to
 @params originText the text the user entered in the originLanguage
 @params targetText the text that was returned from the translation system in the target language
 @params isFavourite If the translation that is being added has been marked to be saved as a favourite.The function should check it is actually a boolean(true or false or 1 or 0) before inserting.
 */
async function addTranslation(userID, originLanguage, targetLanguage, originText, targetText, isFavourite) {
    if (isFavourite != true && isFavourite != false && isFavourite != 1 && isFavourite != 0) { //If isFavourite is "True" or "False" MySQL will count this as False.
        console.log("ERROR code : databaseMethods.js02 : Non Boolean passed to addTranslation in \"isFavourite\" parameter:" + isFavourite + ".Not adding translation.");
        return 1; //Non 0 exit code to indicate function failed.
    }
    const sql = await init();
    const insertquery = sql.format('insert into Translation  set ? ;', {
        userID: userID,
        originLanguage: originLanguage,
        targetLanguage: targetLanguage,
        originText: originText,
        targetText: targetText,
        isFavourite: isFavourite
    });
    await sql.query(insertquery);
}

/*
 This function (addUser) should insert a new user into the database.  Before inserting the user into the database their password should be hashed so that the password isn't stored in plain text.An error should be returned if a user already exists with that ID
 To to perform the hashing we are using the 'sha256' node package.
 @params userID the identification of the newly created user.
 @params fName the users first name. Useful to store so the website can greet them using their name.
 @params password the password the user entered into the web form. This is hashed AFTER being passed to the function do NOT pass the hashed version.
 @params nativeLanguage the native language the user selected from a dropdown of options. This affects which language the system will try to translate from if they do not tell the system which language to translate from.
 TODO force certain criteria of the password e.g. > 8 characters long?
 TODO Should we be hashing before the password is sent over the internet so it can't be packet sniffed?
 TODO return a nice error if the user already exists
 */
async function addUser(userID, fName, password, nativeLanguage) {
    const sql = await init();
    let hashedPassword = sha256(password);
    const insertquery = sql.format('insert into User  set ? ;', {
        userID: userID,
        fName: fName,
        password: hashedPassword,
        nativeLanguage: nativeLanguage
    });
    try {
        await sql.query(insertquery);
    } catch (e) {
        console.log("ERROR code : databaseMethods.js05 : Error adding user.User may already exist in the database.user: "+userID);
    }
}

/*
 This function (retrieveLoginData) would return the hashed password for the given account so it can be checked against the password that the user is trying to sign in using.Errors should be raised if multiple accounts are found with the same ID or if there is no account found with the given ID.
 @params userID the username of the account that is trying to be accessed
 @return Either the hashed password as a string or an appropriate error message
 TODO surely given the user enters their email to signin not a userID their email should be passed. This would require us to store their email in the database hence changing the Tables.sql file.
 TODO Handle errors more elegantly than returning an error message as this relies on the calling function to expect a specific error string.Potentially use break statements
*/
async function retrieveHashedPassword(userID) {
    const sql = await init();
    const query = sql.format(`select password from User where userID = ?`, userID);
    const [resultOfQuery] = await sql.query(query);
    if (resultOfQuery.length > 1) {
        console.log("ERROR code : databaseMethods.js03 : multiple accounts found with same usedID"); //This should NEVER happen but should still be protected against
        return "ERROR code : databaseMethods.js03 : multiple accounts found with same usedID";
    }
    if (resultOfQuery.length == 0) {
        console.log("ERROR code : databaseMethods.js04 : no password found with userID: " + userID);
        return ("ERROR code : databaseMethods.js04 : no password found with userID: " + userID);
    }
    return (resultOfQuery[0].password);
}

/*
 This function (viewNonFavouriteTranslations) should return ALL translations that the given user has done that they HAVE NOTmarked as favourites.
 @params userID the username of the account that is trying to be accessed
 @return This should return an array where each row that matches the SQL query is an element in the array.
*/
async function viewNonFavouriteTranslations(userID) {
    const sql = await init();
    const query = sql.format(`select originLanguage,targetLanguage,originText,targetText from Translation where isFavourite = false and userID = ?`, userID);
    const [resultOfQuery] = await sql.query(query);
    return resultOfQuery;
}

/*
 This function (viewNonFavouriteTranslations) should return ALL translations that the given user has done that they HAVE marked as favourites.
 @params userID the username of the account that is trying to be accessed
 @return This should return an array where each row that matches the SQL query is an element in the array.
*/
async function viewFavouriteTranslations(userID) {
    const sql = await init();
    const query = sql.format(`select originLanguage,targetLanguage,originText,targetText from Translation where isFavourite = true and userID = ?`, userID);
    const [resultOfQuery] = await sql.query(query);
    return resultOfQuery;
}

/*
 This function (retrieveNativeLanguage) gets a users native language from the database.Errors should be thrown if no native language is found or multiple native languages are found.
 @params userID the username of the account that is trying to be accessed
 @return The users native language as a string
*/
async function retrieveNativeLanguage(userID) {
    const sql = await init();
    const query = sql.format(`select nativeLanguage from User where userID = ?`, userID);
    const [resultOfQuery] = await sql.query(query);
    if (resultOfQuery.length == 0){
        console.log("ERROR code : databaseMethods.js06 : No nativeLanguage found for userID: "+ userID);
        return ("ERROR code : databaseMethods.js06 : No nativeLanguage found for userID: "+ userID);
    }
    if (resultOfQuery.length > 1){
        console.log("ERROR code : databaseMethods.js07 : More than one native language found for userID: "+userID);
        return ("ERROR code : databaseMethods.js07 : More than one native language found for userID: "+userID);
    }
    let nativeLanguage = resultOfQuery[0].nativeLanguage;
    return nativeLanguage;
}

//Boilerplate code for MySQL connections

let sqlPromise = null;

async function init() {
    if (sqlPromise) return sqlPromise;

    sqlPromise = newConnection();
    return sqlPromise;
}

async function newConnection() {
    // todo: this should really use connection pools
    const sql = await mysql.createConnection(config.mysql);
    console.log("Connection to database made.");

    // handle unexpected errors by just logging them
    sql.on('error', (err) => {
        console.error("sqlError: " + err);
        sql.end();
    });
    return sql;
}

connectionTester(); //Checking that a connection to the database can be made.
console.log("Database methods successfully imported.");


//Tests TODO remove below function once system is ready for release.
function tests(){
    addUser(12345, "smith", "password123456789", "Spanish");
    addUser(123456, "smith", "password12345", "Spanish");
    addTranslation(123456, "English", "Spanish", "Hello", "Hola", true);
    addTranslation(123456, "English", "German", "Hello", "Halo", false);
    addTranslation(123456, "English", "German", "Hello", "Halo", 0);
    addTranslation(123456, "English", "German", "Hello", "Halo", 1);
    retrieveHashedPassword(12345);
    retrieveHashedPassword(123456);
    viewNonFavouriteTranslations(123456);
    viewFavouriteTranslations(123456);
    retrieveNativeLanguage(123456);
}
tests();
