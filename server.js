/**
 * Created by vasi2401 on 2015-09-18.
 */

// set up
var express = require('express');
var app = module.exports = express(); // cr�ation de l'app avec express
var mysql = require('./config/database');
var port = 8080;
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

//configuration
app.use(express.static(__dirname + '/public'));

// load the routes
require('./controllers/routes')(app, passport);

require('./config/passport')(passport); // pass passport for configuration
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//listen (start app with node server.js)
app.listen(port);
console.log("App listening on port " + 8080);