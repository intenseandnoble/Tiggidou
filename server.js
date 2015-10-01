/**
 * Created by vasi2401 on 2015-09-18.
 */

// set up
var express = require('express');
var app = module.exports = express(); // cr�ation de l'app avec express
var mysql = require('./config/database');


//configuration
app.use(express.static(__dirname + '/public'));

// load the routes
require('./controllers/routes')(app);
require('./controllers/post')(app);
//listen (start app with node server.js)
app.listen(8080);
console.log("App listening on port 8080");