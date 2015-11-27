/**
 * Created by vasi2401 on 2015-09-18.
 */

var post = require('./post.js');
var get = require('./get.js');
var utils = require('./utils.js');

// show routes to app
module.exports = function (app, passport) {


// routes ======================================================================

    // api ---------------------------------------------------------------------
    //INDEX
    app.get('/', get.getIndex);

    // profile
    app.get(['/profile', '/profile/:username'], utils.requireAuth, get.getProfile);

    app.post('/profile/upload', post.postUploadProfileAvatar);

    app.post('/rate_driver', post.postRateDriver);

    app.post('/rate_passenger', post.postRatePassenger);

    app.post('/post_comment', post.postComment);

    app.post('/post-ride', post.postRide);

    app.get('/search', get.getSearchRide);

    app.get('/select-passenger', get.getSelectedPassenger);

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

    app.post('/login', function (req, res, next) {
        post.postLogin(req, res, next, passport)}
    );

    app.get('/sign-up', get.getSignUp);

    app.post('/sign-up', function(req, res, next) {
        post.postSignUp(req, res, next, passport)
    });

    app.get('/results', get.getResults);

    app.get('/no-results', get.getNoResult);

    app.get('/ask-ride', utils.requireAuth, get.getAskRide);

    app.get('/logout', get.getLogout);

    app.get('/travel/all', get.getAllTravels);

    app.get('/travel/:travelId', get.getTravel);

    app.get('/travelrequest/all', get.getAllTravelRequests);

    app.get('/travelrequest/:reqTravelId', get.getTravelRequest);

};