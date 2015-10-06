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
        res.render('fr/index.html');
    });

    // rechercher
    app.get('/search', function (req, res) {

        //faire une recherche et afficher son r�sultat

    });

    // profile
    app.get('/profile', requireAuth, function(req, res){
        res.render('fr/profile.html'/*, {
            user : req.user //get the user out of session and pass to template
        }*/)
    });

    // login
    app.get('/login', function(req, res) {
        if(req.user){
            res.redirect('/');
        }
        else{
            res.render('fr/login.html'/*, {message: req.flash('loginMessage')}*/);
        }
    });/*
    app.post('/login', function(req, res, next){
        console.log("Passer par login");
        passport.authenticate('local-login', {
            successRedirect : '/profile',
            failureRedirect : '/login',
            failureFlash : true //allow flash message
            },
            function(err, user, info){
                if(err) {
                    return res.render('signin', {title: 'Sign In', errorMessage: err.message});
                }

                if(!user) {
                    return res.render('signin', {title: 'Sign In', errorMessage: info.message});
                }
                return req.logIn(user, function(err) {
                    if(err) {
                        return res.render('signin', {title: 'Sign In', errorMessage: err.message});
                    } else {
                        return res.redirect('/');
                    }
                })(req, res, next);
        })
        console.log("complété login");
    } );*/
    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', {
                successRedirect : '/profile',
                failureRedirect : '/login',
                failureFlash : true //allow flash message
            },
            function(err, user, info) {
                if(err) {
                    return res.render('fr/login.html', {title: 'Login', errorMessage: err.message});
                }

                if(!user) {
                    return res.render('fr/login.html', {title: 'Login', errorMessage: info.message});
                }
                return req.logIn(user, function(err) {
                    if(err) {
                        return res.render('fr/login.html', {title: 'Login', errorMessage: err.message});
                    } else {
                        return res.redirect('/profile');
                    }
                });
            })(req, res, next);
    });

    // signup
    app.get('/sign-up', function (req, res) {
        res.render('fr/sign-up.html'/*, {message: req.flash('signupMessage')}*/);
    });

    //processs the signup form
    app.post('/sign-up', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/'/*'/sign-up'*/, // redirect back to the signup page if there is an error
        failureFlash : false//true // allow flash messages
    }));

    app.get('/results', function (req, res) {
        res.render('fr/results.html')
    });

    app.get('/no-results', function (req, res) {
        res.render('fr/no-results.html')
    });

    app.get('/ask-ride', requireAuth, function (req, res) {
        res.render('fr/ask-ride.html')
    });
    app.get('/logout',requireAuth, function(req, res){
        req.logout();
        res.redirect('/');
    })

    //... ajouter plus de fonctionalit�s

};

// route middleware to make sure a user is logged in
function requireAuth(req, res, next) {
    //Check if the user is logged in
    if (req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
};






