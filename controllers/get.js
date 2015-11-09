/**
 * Created by dave on 09/11/15.
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


module.exports = {
    getIndex: getHome,
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
            logged: authentificated(req),
            header: header,
            foot : foot
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

        new Model.Travel().where({
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
                logged: authentificated(req),
                header: header,
                foot: foot //In case of error

            });

        });

    }

    else {

        new Model.TravelRequest().where({
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
                logged: authentificated(req),
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
                logged: authentificated(req),
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
            logged: authentificated(req),
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
            logged: authentificated(req),
            header: header,
            foot : foot
        });
}
function getResults(req, res) {
    //res.render('pages/results.ejs')
    res.render('pages/results.ejs',
        {
            logged: authentificated(req),
            header: header,
            foot : foot
        });
}

function getNoResult(req, res) {
    //res.render('pages/no-results.ejs')
    res.render('pages/no-results.ejs',
        {
            logged: authentificated(req),
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


//TODO a supprimer quand les modèles seront refait
function getUserName(id){

    var firstName = "Unknown";

    var finishRequest = function () {return firstName;};

    new Model.Users({idUser: id}).fetch().then(function (model) {
        firstName = model.get('firstName');
        console.log(id + " : " + firstName);
        finishRequest();
    });
}

var commentariesTexts = [];

function getUsernameFromDBAsync(userId) {

    return new Model.Users({
        idUser: userId
    })
        .fetch()
        .then(function(u){
            var prenom = u.get('firstName');
            var nom = u.get('familyName');
            var s = prenom + " " + nom;
            return s;
        });
}

function updateSeats(travelId, takenSeats, availableSeats){

    new Model.Travel().where({
        idAddTravel: travelId
    }).save({

        takenSeat :takenSeats+1,
        availableSeat : availableSeats-1

    }, {method: 'update'}).catch(function (err) {
        log.error(err);
    });

}

function addTravelPassenger(travelId, userId){

    new Model.TravelPassengers().save({
            passenger:userId,
            travel : travelId

        },
        {method: 'insert'}
    ).catch(function (err) {
            log.error(err);
        });

}