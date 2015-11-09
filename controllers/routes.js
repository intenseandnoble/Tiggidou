/**
 * Created by vasi2401 on 2015-09-18.
 */

//load the model
var Model = require('../models/models');
var bcrypt = require('bcrypt-nodejs');
var https = require('https');
var Promise = require('bluebird');
var mailling = require('../config/mailer.js');
var log = require('../config/logger').log;
var moment = require("moment");
var multer = require('multer');
var pathAvatar = './public/images/avatar';

//View en français
var header = require('../views/fr/header.js');
var foot = require('../views/fr/footer.js');
var loginString = require('../views/fr/sign.js');

var post = require('./post.js');
var get = require('./get.js');
// show routes to app
module.exports = function (app, passport) {


// routes ======================================================================

    // api ---------------------------------------------------------------------
    //INDEX
    app.get('/', get.getIndex);

    // profile
    app.get(['/profile', '/profile/:username'],requireAuth,function(req, res){
        //Todo prendre les donnees de l'utilisateur connecte
        //Todo faire en sorte qu'un vote soit pris en compte par le serveur/bd
        var Juser = req.session.req.user;
        var driverAvgScore;
        var driverPScore;
        var driverCScore;
        var driverRScore;
        var driverSScore;
        var driverOScore;

        var passengerAvgScore;
        var passengerPScore;
        var passengerCScore;
        var passengerLScore;

        var userName;
        var userAvatar;
        var un = req.params.username;
        var page;

        var userId;
        var commentariesTexts = [];
        var promiseArr = [];

        if (un == Juser.attributes.username || un== undefined) {
            page = 'pages/my-profile.ejs';
        } else {
            page = 'pages/profile.ejs'
        }

        new Model.Users()
            .query({where:{'username': un}, orWhere:{'idUser': Juser.attributes.idUser}})
            .fetch()
            .then(function(user) {
            if(user) {

                //nom d'utilisateur
                userName = user.get("firstName") + " " + user.get("familyName");
                userAvatar = user.get("avatar");

                //calcul du score
                /* driver scores */
                driverAvgScore = roundingCeilOrFloor(user.get('driverTotalScore') / (user.get('driverNbVotes') * 5));
                driverPScore = roundingCeilOrFloor(user.get('dPunctualityScore') / user.get('driverNbVotes'));
                driverCScore = roundingCeilOrFloor(user.get('dCourtesyScore') / user.get('driverNbVotes'));
                driverRScore = roundingCeilOrFloor(user.get('dReliabilityScore') / user.get('driverNbVotes'));
                driverSScore = roundingCeilOrFloor(user.get('dSecurityScore') / user.get('driverNbVotes'));
                driverOScore = roundingCeilOrFloor(user.get('dComfortScore') / user.get('driverNbVotes'));

                /* passenger scores */
                passengerAvgScore = roundingCeilOrFloor(user.get('passengerTotalScore') / (user.get('passengerNbVotes') * 3));
                passengerPScore = roundingCeilOrFloor(user.get('pPunctualityScore') / user.get('passengerNbVotes'));
                passengerCScore = roundingCeilOrFloor(user.get('pCourtesyScore') / user.get('passengerNbVotes'));
                passengerLScore = roundingCeilOrFloor(user.get('pPolitenessScore') / user.get('passengerNbVotes'));

                //commentaires
                userId = user.get('idUser');
                new Model.Comments().where({
                    commentType: 0,
                    commentProfileId: userId
                }).fetchAll({withRelated:['user']})
                    //TODO limit the number of results
                    .then(function (comm) {

                        var resultJSON = comm.toJSON();

                        if (resultJSON.length == 0) {
                            //TODO if no comments
                        } else {

                            for(i= 0; i<resultJSON.length; ++i) {
                                commentariesTexts.push(resultJSON[i]['comment']);
                                promiseArr.push(getUsernameFromDBAsync(resultJSON[i]['commentIssuer']));
                            }
                        }

                        Promise.all(promiseArr).then(function(ps){

                            res.render(page,{
                            logged: authentificated(req),
                            userName : userName,
                            avatarImage: userAvatar,

                            driverAverageScore : driverAvgScore,
                            dPunctualityScore: driverPScore,
                            dCourtesyScore: driverCScore,
                            dReliabilityScore: driverRScore,
                            dSecurityScore: driverSScore,
                            dComfortScore: driverOScore,

                            passengerAverageScore : passengerAvgScore,
                            pPunctualityScore: passengerPScore,
                            pCourtesyScore: passengerCScore,
                            pPolitenessScore: passengerLScore,

                            comments:commentariesTexts,
                            commentsIssuers:ps,
                            userOfProfile:user.get('username'),

                            age:user.get('age'),
                            education:user.get('education'),
                            music:user.get('music'),
                            anecdote:user.get('anecdote'),
                            goalInLife:user.get('goalInLife'),

                            profile: require('../views/fr/profile.js'),
                            ratingPnD: require('../views/fr/ratingPnD.js'),

                            foot : foot,
                            header:header


                            });
                        });

                    })
            }
            //TODO page issue de l'else si l'utilisateur est inexistant

        });

    });

    app.post('/profile/upload', post.postUploadProfileAvatar);

    app.post('/rate_driver', post.postRateDriver);

    app.post('/rate_passenger', post.postRatePassenger);

    app.post('/post_profile_comment', post.postProfileComment);

    app.post('/post-ride', post.postRide);

    app.get('/search', get.getSearchRide);

    app.post('/add-passenger', post.postAddPassenger);

    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email', "user_birthday"] }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // send to google to do the authentication
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    app.get('/login', get.getLogin);

    app.post('/login', postLogin);

    app.get('/sign-up', get.getSignUp);

    //processs the signup form
    app.post('/sign-up', post.postSignUp);

    app.get('/results', get.getResults);

    app.get('/no-results', get.getNoResult);

    app.get('/ask-ride',requireAuth, get.getAskRide);

    app.get('/logout', get.getLogout);



    //TODO faire les liens de ceci
    //... ajouter plus de fonctionalit�s
    function postLogin(req, res, next) {
        passport.authenticate('local-login', {
                successRedirect : '/profile',
                failureRedirect : '/login',
                failureFlash : true //allow flash message
            },
            function(err, user, info) {
                //error
                if(err) {
                    req.flash("loginMessage", err);
                    return res.redirect('/login');
                }
                //user don't exist
                if(!user) {
                    req.flash("loginMessage", info);
                    return res.redirect('/login');
                }
                return req.logIn(user, function(err) {
                    //error when trying to login with session
                    if(err) {
                        req.flash("loginMessage", err);
                        return res.redirect('/login');
                    } else {
                        return res.redirect('/profile');
                    }
                });
            })(req, res, next);
    }
};