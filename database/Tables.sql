create database if not exists easyTranslate;

create table if not exists easyTranslate.User(
    userID int auto_increment,
    fName varchar(45),
    password varchar(65), /*sha256 hashes are 64 characters long.*/
    nativeLanguage varchar(45),
    PRIMARY KEY(userID)
);

create table if not exists easyTranslate.Translation(
    translationID int auto_increment,
    userID varchar(45) References User(userID),
    originLanguage varchar(45),
    targetLanguage varchar(45),
    originText varchar(4999),
    targetText varchar(4999),
    isFavourite boolean,
    PRIMARY KEY(translationID)
);
