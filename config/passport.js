/**
 * Created by dave on 28/09/15.
 * configuring the strategies for passport
 * http://passportjs.org/docs
 * https://scotch.io/tutorials/easy-node-authentication-setup-and-local
 */

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User = require('../models/user').Users;
var bcrypt = require('bcrypt-nodejs');
var configAuth = require('./authentification');
var log = require('./logger').log;
var Promise = require('bluebird');
var https = require('https');
var fs = require('fs');
var path = require('path');

// expose this function to our app using module.exports
module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        var id;
        if(user.id){
            id = user.id;
        }else{
            id = user.idUser;
        }
        done(null, id); //saved to session req.session.passport.user = {id:'..'}
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        new User({idUser:id}).fetch().then(function(user){ //user object ataches to the request as req.user
            done(null, user);
        })
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login',new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            if(email){
                new User({email: email}).fetch().then(function(data) {
                    var user = data;
                    if(user === null) {
                        return done(null, false, {message: 'Courriel invalide'});
                    }  else {
                        user = data.toJSON();
                        if(!bcrypt.compareSync(password, user.password)) {
                            return done(null, false, {message: 'Mot de passe invalide'});
                        } else {
                            return done(null, user);
                        }
                    }
                });
            } else{
                return done(null, false, {message: 'Courriel invalide'})
            }

        }
    ));

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    passport.use(new FacebookStrategy({
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: ['id', 'displayName', 'emails', 'name', "photos"]
        },
        // facebook will send back the token and profile
        function(token, refreshToken, profile, done) {
            var email = profile.emails[0].value;
            new User({email: email}).fetch().then(function(data) {
                var user = data;
                if(user) {
                    user = data.toJSON();
                    return done(null, user);
                } else {
                    var promiseArr = [];
                    promiseArr.push(new User().getCountName(profile.name.givenName, profile.name.familyName));
                    var countUser;

                    Promise.all(promiseArr).then(function(ps) {
                        var countTest = ps[0][0];
                        for (var key in countTest) {
                            countUser = countTest[key];
                        }

                        var signUpUser = new User(
                            {
                                idusertemp: profile.id,
                                email: profile.emails[0].value,
                                token: token,
                                familyName: profile.name.familyName,
                                firstName: profile.name.givenName,
                                typeSignUp: "facebook",
                                username: profile.name.givenName + "." + profile.name.familyName + "." + countUser
                            });

                        signUpUser.save().then(function(model) {
                            return done(null, model);
                        });
                    });


                }
            });


        }));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

            clientID        : configAuth.googleAuth.clientID,
            clientSecret    : configAuth.googleAuth.clientSecret,
            callbackURL     : configAuth.googleAuth.callbackURL,
            profileFields: ['id', 'displayName', 'emails', 'name', 'picture']

        },
        function(token, refreshToken, profile, done) {

            // asynchronous
            new User({email: profile.emails[0].value}).fetch().then(function(data) {
                var user = data;
                if(user) {
                    user = data.toJSON();
                    return done(null, user);
                } else {
                    var promiseArr = [];
                    promiseArr.push(new User().getCountName(profile.name.givenName, profile.name.familyName));
                    var countUser;

                    Promise.all(promiseArr).then(function(ps) {
                        var countTest = ps[0][0];
                        for (var key in countTest) {
                            countUser = countTest[key];
                        }

                        var signUpUser = new User(
                            {
                                idusertemp: profile.id,
                                email: profile.emails[0].value,
                                token: token,
                                familyName: profile.name.familyName,
                                firstName: profile.name.givenName,
                                typeSignUp: "google",
                                username: profile.name.givenName + "." + profile.name.familyName + "." + countUser
                            });

                        signUpUser.save().then(function(model) {
                            return done(null, model);
                        });
                    });
                }
            });

        }));


};