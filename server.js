/**
 * Created by vasi2401 on 2015-09-18.
 */

// set up
var express = require('express');
var cfg = require('./config/config').Config;
var mysql = require('./config/database');
var passport = require('passport');
var flash    = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var log = require('./config/logger').log;

var app = module.exports = express(); // cr�ation de l'app avec express
var port = 8080;

app.on('uncaughtException', function(err){
    log.error(err);
});
// set up our express application
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json() ); // to support JSON-encoded bodies
app.use(cookieParser()); // read cookies (needed for auth)

//configuration (public have precedence over the others)
app.use(express.static(__dirname + '/public'));

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//used to render html file
app.engine('html', require('ejs').renderFile); // set up ejs for templating
app.set('view engine', 'ejs'); // set up ejs for templating


// load the routes
require('./config/passport')(passport); // pass passport for configuration
require('./controllers/routes')(app, passport);

process.env.NODE_ENV = cfg.env;
log.info("Mode prod activate: " + process.env.NODE_ENV);


//listen (start app with node server.js)
app.listen(port).on('error', function(err){
    log.error(err);
});
log.info("App listening on port " + port);

