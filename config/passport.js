/**
 * Created by Dave Bernier on 28/09/15.
 * configuring the strategies for passport
 * helper for login, signup and with the session
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
var signFr = require('../views/fr/sign');

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

    //Local login
    passport.use('local-login',new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            //need email to connect
            if(email){
                new User({email: email}).fetch().then(function(data) {
                    var user = data;
                    if(user === null) {
                        return done(null, false, {message: signFr.errEmailInvalid});
                    }  else {
                        user = data.toJSON();
                        //Hash the password to compare with the good one
                        if(!bcrypt.compareSync(password, user.password)) {
                            return done(null, false, {message: signFr.errPwdInvalid});
                        } else {
                            return done(null, user);
                        }
                    }
                });
            //No email received
            } else{
                return done(null, false, {message: signFr.errEmailInvalid})
            }

        }
    ));

    //Facebook signup and signin
    passport.use(new FacebookStrategy({
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: ['id', 'displayName', 'emails', 'name', "photos"]
        },
        // facebook will send back the token and profile
        function(token, refreshToken, profile, done) {
            var email = profile.emails[0].value;
            new User({email: email}).fetch().then(function(userData) {
                var user = userData;
                //existing user, login
                if(user) {
                    user = userData.toJSON();
                    return done(null, user);
                //don't exist, signup
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