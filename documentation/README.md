This file will explain how to view and/or create the documentation.

How to view source code:
1. Navigate into the manual within this folder
2. Launch index.html in a browser of your choice
3. Navigate around the source code within the browser

How To generate documentation from source code:
1. Install NPM and NodeJS. View README.md in the folder above this for help on installation.
2. Install the jsdoc package using NPM(Node Package Manager) using npm install jsdoc
3. Create the documentation by running the command below. This should create a folder called "Auto Generated Documentation" which contains index.html

```
jsdoc -c jsdocConfig.json ..
```

4. Load index.html in a browser
