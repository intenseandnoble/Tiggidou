/**
 * Created by dave on 28/09/15.
 * configuring the strategies for passport
 * http://passportjs.org/docs
 */

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var connection            = require('./database').dbConnection;
var UserModel = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var configAuth = require('./authentification');

// expose this function to our app using module.exports
module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log("serializePassport");
        done(null, user.email);
    });

    // used to deserialize the user
    passport.deserializeUser(function(email, done) {
        console.log("deserializePassport");
        new UserModel.Users({email:email}).fetch().then(function(user){
            done(null, user);
        })
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password'
        },
        function(email, password, done) {
            new UserModel.Users({email: email}).fetch().then(function(data) {
                console.log("strategie login");
                var user = data;
                if(user) {
                    return done(null, false, {title: 'signup', errorMessage: 'username already exists'});
                } else {
                    // MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
                    var password = user.password;
                    var hash = bcrypt.hashSync(password);

                    var signUpUser = new Model.User({email: user.email, password: hash});

                    signUpUser.save().then(function(model) {
                        // sign in the newly registered user
                        loginPost(req, res, next);
                    });
                }
                    user = data.toJSON();
                    if(!bcrypt.compareSync(password, user.password)) {
                        return done(null, false, {message: 'Invalid email or password'});
                    } else {
                        return done(null, user);
                    }
                }
            );
        }));


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
            new UserModel.Users({email: email}).fetch().then(function(data) {
                console.log("strategie login");
                var user = data;
                if(user === null) {
                    return done(null, false, {message: 'Invalid email or password'});
                } else {
                    user = data.toJSON();
                    if(!bcrypt.compareSync(password, user.password)) {
                        return done(null, false, {message: 'Invalid email or password'});
                    } else {
                        return done(null, user);
                    }
                }
            });
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
            profileFields: ['id', 'displayName', 'emails']
        },
        // facebook will send back the token and profile
        function(token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function() {
                new UserModel.UsersFacebook({email: profile.emails[0].value}).fetch().then(function(data) {
                    console.log("data: " + data + "; id: " + profile.id);
                    var user = data;
                    if(user) {
                        return done(null, user);
                    } else {
                        var signUpUser = new UserModel.UsersFacebook(
                            {
                                idUserFacebook: profile.id,
                                email: profile.emails[0].value,
                                token: token,
                                name: profile.displayName
                            });
                        console.log("name:" + profile.name.givenName + ' ' + profile.name.familyName);

                        signUpUser.save().then(function(model) {
                            // sign in the newly registered user
                            return done(null, signUpUser);
                        });



                    }
                });
            });

        }));

};