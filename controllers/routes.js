/**
 * Created by vasi2401 on 2015-09-18.
 */

//load the model
var covoso = require(__dirname + '/../models/covosocialSearchDepartures');
var express = require('express');
var Model = require('../models/user');
var bcrypt = require('bcrypt-nodejs');


// show routes to app
module.exports = function (app, passport) {


// routes ======================================================================

    // api ---------------------------------------------------------------------
    //single page application
    app.get('/', function (req, res) {
        res.render('pages/index.ejs');
    });

    // rechercher
    app.get('/search', function (req, res) {

        //faire une recherche et afficher son r�sultat

    });

    // profile
    app.get('/profile', function(req, res){

        //Donnees statiques et momentanees avant d'avoir les data de bd
        var driverAvgScore = 3;
        var passengerAvgScore = 4;
            res.render('pages/profile.ejs', {
                driverAverageScore : driverAvgScore,
                passengerAverageScore : passengerAvgScore
        });
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // login
    app.get('/login', function(req, res) {
        if(req.user){
            res.redirect('/');
        }
        else{
            res.render('pages/login.ejs'/*, {message: req.flash('loginMessage')}*/);
        }
    });
    app.post('/login', loginPost);

    // signup
    app.get('/sign-up', function (req, res) {
        res.render('pages/sign-up.ejs'/*, {message: req.flash('signupMessage')}*/);
    });

    //processs the signup form
    app.post('/sign-up', function(req, res, next) {
        var user = req.body;
        var usernamePromise = null;
        usernamePromise = new Model.Users({email: user.email}).fetch();
        return usernamePromise.then(function(model) {
            if(model) {
                res.render('pages/sign-up.ejs', {title: 'signup', errorMessage: 'username already exists'});
            } else {
                // MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
                var password = user.password;
                var hash = bcrypt.hashSync(password);
                var signUpUser = new Model.Users({email: user.email, password: hash});

                signUpUser.save().then(function(model) {
                    // sign in the newly registered user
                    loginPost(req, res, next);
                });
            }
        })});

    app.get('/results', function (req, res) {
        res.render('pages/results.ejs')
    });

    app.get('/no-results', function (req, res) {
        res.render('pages/no-results.ejs')
    });

    app.get('/ask-ride', requireAuth, function (req, res) {
        res.render('pages/ask-ride.ejs')
    });
    app.get('/logout',requireAuth, function(req, res){
        req.logout();
        res.redirect('/');
    })

    //... ajouter plus de fonctionalit�s
    function loginPost(req, res, next) {
        passport.authenticate('local-login', {
                successRedirect : '/profile',
                failureRedirect : '/login',
                failureFlash : true //allow flash message
            },
            function(err, user, info) {
                if(err) {
                    return res.render('pages/login.ejs', {title: 'Login', errorMessage: err.message});
                }

                if(!user) {
                    return res.render('pages/login.ejs', {title: 'Login', errorMessage: info.message});
                }
                return req.logIn(user, function(err) {
                    if(err) {
                        return res.render('pages/login.ejs', {title: 'Login', errorMessage: err.message});
                    } else {
                        return res.redirect('/profile');
                    }
                });
            })(req, res, next);
    };

};

// route middleware to make sure a user is logged in
function requireAuth(req, res, next) {
    //Check if the user is logged in
    if (req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
};








