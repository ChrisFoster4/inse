easyTranslate project for INSE

Install instructions:
Dependecies:
Mysql : https://dev.mysql.com/downloads/mysql/
NodeJS : https://nodejs.org/en/download/
NPM : Should be installed with NodeJS

Configuration:
MySQL:
Initialise the database by:
Change to the "database" directory and run
```
mysql -u root -p < Tables.sql
```
Edit the config.json file in the database directory so that the "password" field is the same as your MySQL root password.If your MySQL password is "root" you can skip this step.

Install NPM packages:
Make sure you are in the root of the INSE directory.
To install the needed packages run:
```
npm install
``` 

To run the server type:
```
npm run server
```
Or go to the webserver directory and run
```
node server.js
```

To use the client go to the following address in your browser of choice:
```
localhost:8080/main.html
```
Ensure you have cookies enabled and no browser extensions which may block the Google Authentication(Such as certain adblocks) and enjoy.

To run the automated tests run:
```
npm test
```
