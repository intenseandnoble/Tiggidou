/**
 * Created by vasi2401 on 2015-09-18.
 */

//load the model
var covoso = require(__dirname + '/../models/covosocialSearchDepartures');
var express = require('express');


// show routes to app
module.exports = function (app, passport) {


// routes ======================================================================

    // api ---------------------------------------------------------------------
    //single page application
    app.get('/', function (req, res) {
        res.sendFile('/views/fr/index.html', {root: './'});
    });

    // rechercher
    app.get('/search', function (req, res) {

        //faire une recherche et afficher son r�sultat

    });

    // profile
    app.get('/profile', isLoggedIn, function (req, res) {
        res.sendFile('/views/fr/profile.html', {root: './'})
    });

    // login
    app.get('/login', function (req, res) {
        res.sendFile('/views/fr/login.html', {root: './'})
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // signup
    app.get('/sign-up', function (req, res) {
        res.sendFile('/views/fr/sign-up.html', {root: './'})
    });
    //processs the signup form
    app.post('/sign-up', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/sign-up', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/results', function (req, res) {
        res.sendFile('/views/fr/results.html', {root: './'})
    });

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    })

    //... ajouter plus de fonctionalit�s

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}