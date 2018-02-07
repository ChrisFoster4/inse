create table User (userID int auto_increment,
fName varchar(45),
password varchar(45),
nativeLanguage Varchar(45),
PRIMARY KEY(userID)
);

create table Translation(translationID int auto_increment,
userID varchar(45) References User(userID),
originLanguage varchar(45),
targetLanguage varchar(45),
originText varchar(4999),
targetText varchar(4999),
isFavourite boolean,
PRIMARY KEY(translationID)
);
