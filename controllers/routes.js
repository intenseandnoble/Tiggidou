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
        var foot;
        var header;
        foot = require('../views/fr/footer.js');
        header = require('../views/fr/header.js');
        res.render('pages/index.ejs',
            {
                header: header,
                foot : foot
            });
    });

    // rechercher
    app.get('/search', function (req, res) {

        //faire une recherche et afficher son r�sultat

    });

    // profile
    app.get('/profile', function(req, res){

        //Todo prendre les donnees de l'utilisateur connecte
        //Todo faire en sorte qu'un vote soit pris en compte par le serveur/bd
        var driverAvgScore;
        var passengerAvgScore;
        var userName;
        var pageName;
        var foot;
        var header;

        new Model.Users({'email': 'OALd@allo.com' }).fetch().then(function(user) {
            //nom de la page
            pageName = "Profil";

            //nom d'utilisateur
            userName = user.get('firstName') + " " + user.get('familyName');
            //anecdotes personnelles

            //photo de profil

            //commentaires


            //calcul du score
            driverAvgScore = user.get('driverTotalScore')/user.get('driverNbVotes');
            if (driverAvgScore%1 != 0 && driverAvgScore%1 >= 0.5) {
                driverAvgScore = Math.ceil(driverAvgScore);

            } else if (driverAvgScore%1 < 0.5) {
                driverAvgScore = Math.floor(driverAvgScore);
            }

            passengerAvgScore = user.get('passengerTotalScore')/user.get('passengerNbVotes');
            if (passengerAvgScore%1 != 0 && passengerAvgScore%1 >= 0.5) {
                passengerAvgScore = Math.ceil(passengerAvgScore);
            } else if (passengerAvgScore%1 < 0.5) {
                passengerAvgScore = Math.floor(passengerAvgScore);
            }

            header = require('../views/fr/header.js');
            foot = require('../views/fr/footer.js');

        }).then(function (obj)   {
            res.render('pages/profile.ejs',{
                pageName : pageName,
                userName : userName,
                driverAverageScore : driverAvgScore,
                passengerAverageScore : passengerAvgScore,
                foot : foot,
                header:header
            })});

    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // login
    app.get('/login', function(req, res) {
        if(req.user){
            res.redirect('/');
        }
        else{
            //res.render('pages/login.ejs'/*, {message: req.flash('loginMessage')}*/);
            var foot;
            var header;
            foot = require('../views/fr/footer.js');
            header = require('../views/fr/header.js');
            res.render('pages/login.ejs',
                {
                    header: header,
                    foot : foot
                });
        }
    });
    app.post('/login', loginPost);

    // signup
    app.get('/sign-up', function (req, res) {
        //res.render('pages/sign-up.ejs'/*, {message: req.flash('signupMessage')}*/);
        var foot;
        var header;
        foot = require('../views/fr/footer.js');
        header = require('../views/fr/header.js');
        res.render('pages/sign-up.ejs',
            {
                header: header,
                foot : foot
            });
    });

    //processs the signup form
    app.post('/sign-up', function(req, res, next) {
        var user = req.body;
        var usernamePromise = null;
        usernamePromise = new Model.Users({email: user.email}).fetch();
        return usernamePromise.then(function(model) {
            if(model) {
                var foot;
                var header;
                foot = require('../views/fr/footer.js');
                header = require('../views/fr/header.js');
                res.render('pages/sign-up.ejs', {
                    title: 'signup',
                    errorMessage: 'username already exists',
                    header: header,
                    foot : foot});
            } else {
                // TODO MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
                var password = user.password;
                var hash = bcrypt.hashSync(password);
                var typeSign = "local";
                var firstName = user.firstName;
                var familyName = user.familyName;
                var signUpUser = new Model.Users({
                    email: user.email,
                    password: hash,
                    typeSignUp: typeSign,
                    firstName: firstName,
                    familyName: familyName
                });

                signUpUser.save().then(function(model) {
                    // sign in the newly registered user
                    loginPost(req, res, next);
                });
            }
        })});

    app.get('/results', function (req, res) {
        //res.render('pages/results.ejs')
        var foot;
        var header;
        foot = require('../views/fr/footer.js');
        header = require('../views/fr/header.js');
        res.render('pages/results.ejs',
            {
                header: header,
                foot : foot
            });
    });

    app.get('/no-results', function (req, res) {
        //res.render('pages/no-results.ejs')
        var foot;
        var header;
        foot = require('../views/fr/footer.js');
        header = require('../views/fr/header.js');
        res.render('pages/no-results.ejs',
            {
                header: header,
                foot : foot
            });
    });

    app.get('/ask-ride', requireAuth, function (req, res) {
        //res.render('pages/ask-ride.ejs')
        var foot;
        var header;
        foot = require('../views/fr/footer.js');
        header = require('../views/fr/header.js');
        res.render('pages/ask-ride.ejs',
            {
                header: header,
                foot : foot
            });
    });
    app.get('/logout',requireAuth, function(req, res){
        req.logout();
        res.redirect('/');
    });

    //TODO faire les liens de ceci
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
    }
    function loginSignFacebook(req, res, next) {
        passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/sign-up'
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
    }
};

// route middleware to make sure a user is logged in
function requireAuth(req, res, next) {
    //Check if the user is logged in
    if (req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
}








