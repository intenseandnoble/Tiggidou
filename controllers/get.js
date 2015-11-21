/**
 * Created by dave on 09/11/15.
 */
//View en français
var headerFR = require('../views/fr/header.js');
var footFR = require('../views/fr/footer.js');
var loginStringFR = require('../views/fr/sign.js');

//Models and utils
var utils = require('./utils.js');
var log = require('../config/logger').log;
var searchRide = require('../models/searchRide.js');
var profile = require('../models/profile.js');
var Model = require('../models/models');


module.exports = {
    getIndex: getHome,
    getProfile: getProfile,
    getSearchRide: getSearchRide,
    getLogin: getLogin,
    getSignUp: getSignUp,
    getAskRide: getAskRide,
    getResults: getResults,
    getNoResult: getNoResult,
    getLogout: getLogout
};

function getHome(req, res) {
    res.render('pages/index.ejs',
        {
            logged: utils.authentificated(req),
            header: headerFR,
            foot : footFR
        });
}



function getProfile(req, res){
    //Todo prendre les donnees de l'utilisateur connecte
    //Todo faire en sorte qu'un vote soit pris en compte par le serveur/bd
    var userSession = req.session.req.user;
    var usernameParams = req.params.username;
    var profileDisplay = new profile();

    var page;
    if (usernameParams == userSession.attributes.username || usernameParams == undefined) {
        page = 'pages/my-profile.ejs';
    } else {
        page = 'pages/profile.ejs'
    }

    new Model.ModelUsers.Users()
        .query({where:{'username': usernameParams}, orWhere:{'idUser': userSession.attributes.idUser}})
        .fetch()
        .then(function(user) {
            if(user) {
                profileDisplay.setUserValue(user);
                profileDisplay.displayProfile(req, res, page);
            }
            else{
                res.redirect('/login');
            }
        });
}



function getSearchRide(req, res) {
    var ride = new searchRide(req.query.destination, req.query.currentLocation, req.query.datepicker);



    if(req.query.searchDriver == "on") {
        ride.searchDriver(req, res);
    }
    else {
        ride.searchPassengers(req, res);
    }

}



function getLogin(req, res) {
    if(req.user){
        res.redirect('/');
    }
    else{
        res.render('pages/login.ejs',
            {
                logged: utils.authentificated(req),
                login: loginStringFR,
                header: headerFR,
                foot : footFR,
                message: req.flash('loginMessage')
            });
    }
}

function getSignUp(req, res) {
    if(req.user){
        res.redirect("/");
    }
    res.render('pages/sign-up.ejs',
        {
            logged: utils.authentificated(req),
            login: loginStringFR,
            header: headerFR,
            foot : footFR,
            message: req.flash('signupMessage')
        });
}

function getAskRide (req, res) {
    res.render('pages/ask-ride.ejs',
        {
            logged: utils.authentificated(req),
            header: headerFR,
            foot : footFR
        });
}
function getResults(req, res) {
    res.render('pages/results.ejs',
        {
            logged: utils.authentificated(req),
            header: headerFR,
            foot : footFR
        });
}

function getNoResult(req, res) {
    res.render('pages/no-results.ejs',
        {
            logged: utils.authentificated(req),
            header: headerFR,
            foot : footFR
        });
}
function getLogout(req, res){
    if (req.isAuthenticated()){
        req.logout();
    }

    res.redirect('/');
}

