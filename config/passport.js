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

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL
    },
    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {
            new UserModel.UsersFacebook({idUserFacebook: profile.id}).fetch().then(function(data) {
                console.log("facebook login");
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

            // find the user in the database based on their facebook id
            /*User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });*/
        });

    }));

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

};