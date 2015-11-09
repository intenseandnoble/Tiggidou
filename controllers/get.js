/**
 * Created by dave on 09/11/15.
 */

//load the model
var Model = require('../models/models');
var https = require('https');
var Promise = require('bluebird');
var mailling = require('../config/mailer.js');
var log = require('../config/logger').log;

//View en français
var header = require('../views/fr/header.js');
var foot = require('../views/fr/footer.js');
var loginString = require('../views/fr/sign.js');
var profile = require('../views/fr/profile.js');
var ratingPnD = require('../views/fr/ratingPnD.js');

var utils = require('./utils.js');


module.exports = {
    getIndex: getHome,
    getProfile: getProfile,
    getSearchRide: getSearchRide,
    getLogin: getLogin,
    getSignUp: getSignUp,
    getAskRide: getAskRide,
    getResults: getResults,
    getNoResult: getNoResult,
    getLogout: getLogout
};

function getHome(req, res) {
    res.render('pages/index.ejs',
        {
            logged: utils.authentificated(req),
            header: header,
            foot : foot
        });
}

function getProfile(req, res){
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

    new Model.ModelUsers.Users()
        .query({where:{'username': un}, orWhere:{'idUser': Juser.attributes.idUser}})
        .fetch()
        .then(function(user) {
            if(user) {

                //nom d'utilisateur
                userName = user.get("firstName") + " " + user.get("familyName");
                userAvatar = user.get("avatar");

                //calcul du score
                /* driver scores */
                driverAvgScore = utils.roundingCeilOrFloor(user.get('driverTotalScore') / (user.get('driverNbVotes') * 5));
                driverPScore = utils.roundingCeilOrFloor(user.get('dPunctualityScore') / user.get('driverNbVotes'));
                driverCScore = utils.roundingCeilOrFloor(user.get('dCourtesyScore') / user.get('driverNbVotes'));
                driverRScore = utils.roundingCeilOrFloor(user.get('dReliabilityScore') / user.get('driverNbVotes'));
                driverSScore = utils.roundingCeilOrFloor(user.get('dSecurityScore') / user.get('driverNbVotes'));
                driverOScore = utils.roundingCeilOrFloor(user.get('dComfortScore') / user.get('driverNbVotes'));

                /* passenger scores */
                passengerAvgScore = utils.roundingCeilOrFloor(user.get('passengerTotalScore') / (user.get('passengerNbVotes') * 3));
                passengerPScore = utils.roundingCeilOrFloor(user.get('pPunctualityScore') / user.get('passengerNbVotes'));
                passengerCScore = utils.roundingCeilOrFloor(user.get('pCourtesyScore') / user.get('passengerNbVotes'));
                passengerLScore = utils.roundingCeilOrFloor(user.get('pPolitenessScore') / user.get('passengerNbVotes'));

                //commentaires
                userId = user.get('idUser');
                new Model.ModelComments.Comments().where({
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
                                promiseArr.push(Model.ModelUsers.getUsernameFromDBAsync(resultJSON[i]['commentIssuer']));
                            }
                        }

                        Promise.all(promiseArr).then(function(ps){

                            res.render(page,{
                                logged: utils.authentificated(req),
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

                                profile: profile,
                                ratingPnD: ratingPnD,
                                foot : foot,
                                header:header


                            });
                        });

                    })
            }
            //TODO page issue de l'else si l'utilisateur est inexistant

        });

}

function getSearchRide(req, res) {


    var idTravel_arr = [];
    var driver_arr = [];
    var passenger_arr=[];
    var comment_arr = [];
    var seatsTaken_arr = [];
    var seatsAvailable_arr = [];
    var travelTime_arr = [];
    var departureTime_arr = [];
    var departureDate_arr = [];
    var luggageSize_arr = [];
    var petsAllowed_arr = [];
    var cost_arr = [];

    var dest = req.query.destination;
    var currLocation = req.query.currentLocation;


    //var date= new Date(req.query.datepicker);
    var date=req.query.datepicker;
    var newdate = date.split("/").reverse().join("/");
    newdate = new Date(newdate);


    var finishRequest = function () {
        res.render('pages/results.ejs', {
            idTravel:idTravel_arr,
            drivers: driver_arr,
            passengers: passenger_arr,
            comment: comment_arr,
            seatsTaken: seatsTaken_arr,
            seatsAvailable: seatsAvailable_arr,
            travelTime: travelTime_arr,
            departureTime: departureTime_arr,
            departureDate: departureDate_arr,
            luggageSize: luggageSize_arr,
            petsAllowed: petsAllowed_arr,
            cost: cost_arr,
            destination: dest,
            currentLocation: currLocation,
            logged: authentificated(req),
            header: header,
            foot: foot
        });
    };

    if(req.query.searchDriver == "on") {

        new Model.ModelTravel.Travel().where({
            destinationAddress: dest,
            startAddress: currLocation
        }).query(function (qb) {
            qb.orderBy('departureDate', 'ASC');
        }).fetchAll().then(function (user) {

            var resultJSON = user.toJSON();

            if (resultJSON.length == 0) {
                res.render('pages/no-results.ejs', {
                    logged: authentificated(req),
                    header: header,
                    foot: foot
                });
            }
            else {

                for (i = 0; i < resultJSON.length; i++) {

                    if(newdate <= resultJSON[i]['departureDate'])
                    {
                        idTravel_arr.push(resultJSON[i]['idAddTravel']);
                        driver_arr.push(resultJSON[i]['driver']);
                        luggageSize_arr.push(resultJSON[i]['luggagesSize']);
                        departureTime_arr.push(resultJSON[i]['departureTime']);
                        comment_arr.push(resultJSON[i]['comments']);
                        petsAllowed_arr.push(resultJSON[i]['petsAllowed']);
                        departureDate_arr.push(resultJSON[i]['departureDate']);
                        seatsAvailable_arr.push(resultJSON[i]['availableSeat']);
                        seatsTaken_arr.push(resultJSON[i]['takenSeat']);
                        cost_arr.push(resultJSON[i]['cost']);
                    }

                }

                finishRequest();
            }

        }).catch(function (err) {

            res.render('pages/no-results.ejs', {
                logged: utils.authentificated(req),
                header: header,
                foot: foot //In case of error

            });

        });

    }

    else {

        new Model.ModelTravelRequest.TravelRequest().where({
            destinationAddress: dest,
            startAddress: currLocation
        }).query(function (qb) {
            qb.orderBy('departureDate', 'ASC');
        }).fetchAll().then(function (user) {

            var resultJSON = user.toJSON();

            if (resultJSON.length == 0) {
                res.render('pages/no-results.ejs', {
                    logged: utils.authentificated(req),
                    header: header,
                    foot: foot
                });
            }
            else {

                for (i = 0; i < resultJSON.length; i++) {

                    if(newdate <= resultJSON[i]['departureDate'])
                    {
                        idTravel_arr.push(resultJSON[i]['idAddTravel']);
                        passenger_arr.push(resultJSON[i]['passenger']);
                        luggageSize_arr.push(resultJSON[i]['luggageSize']);
                        departureTime_arr.push(resultJSON[i]['departureTime']);
                        comment_arr.push(resultJSON[i]['comments']);
                        petsAllowed_arr.push(resultJSON[i]['pets']);
                        departureDate_arr.push(resultJSON[i]['departureDate']);
                    }

                }

                finishRequest();
            }


        }).catch(function (err) {
            res.render('pages/no-results.ejs', {
                logged: utils.authentificated(req),
                header: header,
                foot: foot //In case of error

            });

        });
    }

}

function getLogin(req, res) {
    if(req.user){
        res.redirect('/');
    }
    else{
        res.render('pages/login.ejs',
            {
                logged: utils.authentificated(req),
                login: loginString,
                header: header,
                foot : foot,
                message: req.flash('loginMessage')
            });
    }
}

function getSignUp(req, res) {
    if(req.user){
        res.redirect("/");
    }
    res.render('pages/sign-up.ejs',
        {
            logged: utils.authentificated(req),
            login: loginString,
            header: header,
            foot : foot,
            message: req.flash('signupMessage')
        });
}

function getAskRide (req, res) {
    //res.render('pages/ask-ride.ejs')
    res.render('pages/ask-ride.ejs',
        {
            logged: utils.authentificated(req),
            header: header,
            foot : foot
        });
}
function getResults(req, res) {
    //res.render('pages/results.ejs')
    res.render('pages/results.ejs',
        {
            logged: utils.authentificated(req),
            header: header,
            foot : foot
        });
}

function getNoResult(req, res) {
    //res.render('pages/no-results.ejs')
    res.render('pages/no-results.ejs',
        {
            logged: utils.authentificated(req),
            header: header,
            foot : foot
        });
}
function getLogout(req, res){
    if (req.isAuthenticated()){
        req.logout();
    }

    res.redirect('/');
}