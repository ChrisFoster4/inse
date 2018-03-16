//Importing required libraries
const mysql = require('mysql2/promise');

const config = require('./config.json'); //Pull in a file containing the database name, host of the database, username to use and the password to use.


/**
  This function (connectionTester) checks that a connection can be made to the database. If the connection fails it should stop the entire server(Not just exit the function).This function should be called at the bottom of the file so when the server starts it checks that the database is reachable.
*/
async function connectionTester() {
    try {
        const sql = await init();
    } catch (e) {
        console.error("ERROR code : databaseMethods.js01 : Could not connect to database. Exiting program now.Error:"+e);
        process.exit(1);
    }
}

/**
 This function (addTranslation) should insert a new translation into the database.
 @params userID the identification number of the user
 @params originLanguage the language the text was translated from
 @params targetLanguage the language the text was translated to
 @params originText the text the user entered in the originLanguage
 @params targetText the text that was returned from the translation system in the target language
 @params isFavourite If the translation that is being added has been marked to be saved as a favourite.The function should check it is actually a boolean(true or false or 1 or 0) before inserting.
 */
async function addTranslation(userID, originLanguage, targetLanguage, originText, targetText, isFavourite) {
    //Javascript treats booleans are true or false but the database wants 1 or 0
    if (isFavourite == "true") isFavourite = 1;
    if (isFavourite == "false") isFavourite = 0;
    if (isFavourite != 1 && isFavourite != 0) { //If isFavourite is "True" or "False" MySQL will count this as False.
        console.error("ERROR code : databaseMethods.js02 : Non Boolean passed to addTranslation in \"isFavourite\" parameter:" + isFavourite + ".Not adding translation.");
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

module.exports.addTranslation = addTranslation;


// Used to delete testTranslations

async function removeUsersTranslations(userID) {
    const sql = await init();
    const insertquery = sql.format('DELETE FROM Translation WHERE ? ;', {
        userID: userID
    });
    await sql.query(insertquery);
}

module.exports.removeUsersTranslations = removeUsersTranslations;

/**
 This function (viewAllTranslations) should return ALL translationss that the user has done regardless of if they are marked as favourites or not.
 @params userID the username of the account that is trying to be accessed
 @return This should return an array where each row that matches the SQL query is an element in the array.
*/
async function viewAllTranslations(userID) {
    const sql = await init();
    const query = sql.format(`select originLanguage,targetLanguage,originText,targetText,isFavourite from Translation where userID = ?`, userID);
    const [resultOfQuery] = await sql.query(query);
    return resultOfQuery;
}
module.exports.viewAllTranslations = viewAllTranslations;


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
