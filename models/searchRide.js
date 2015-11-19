/**
 * Created by dave on 09/11/15.
 */
var Travel = require('./travel').Travel;
var TravelRequest = require('./travelRequest').TravelRequest;
//View en français
var header = require('../views/fr/header.js');
var foot = require('../views/fr/footer.js');
var utils = require('../controllers/utils.js');
var modelUsers = require('./user');
var moment = require('moment');
var Promise = require('bluebird');
var log = require('../config/logger').log;

module.exports = Ride;

var idTravel_arr;
var driver_arr;
var passenger_arr;
var comment_arr;
var seatsTaken_arr;
var seatsAvailable_arr;
var travelTime_arr;
var departureTime_arr;
var departureDate_arr;
var luggageSize_arr;
var petsAllowed_arr;
var cost_arr;
var promiseArr;
var dest;
var currLocation;
var date;
var time;

/*
 * @param {string} temp_dest Valid address
 * @param {string} temp_currlocation Valid address
 * @error
 */
//est-ce qu'on ait aussi sure que le format est bon?
function Ride(temp_dest, temp_currlocation) {

    dest = temp_dest;
    currLocation = temp_currlocation;
    idTravel_arr = [];
    driver_arr = [];
    passenger_arr=[];
    comment_arr = [];
    seatsTaken_arr = [];
    seatsAvailable_arr = [];
    travelTime_arr = [];
    departureTime_arr = [];
    departureDate_arr = [];
    luggageSize_arr = [];
    petsAllowed_arr = [];
    cost_arr = [];
    promiseArr = [];
    date = null;
    time = null;

    moment.locale("fr");
    moment().format('LLL');
}



/*

@param {date} newdate must be a date format
 */
Ride.prototype.searchDriver = function (req, res, newdate) {
    var rechercheOption = getTravelOption();

    if(rechercheOption){
        new Travel().where(rechercheOption).query(function (qb) {
            qb.orderBy('departureDate', 'ASC');
        }).fetchAll().then(function (user) {
            var resultJSON = user.toJSON();

            if (resultJSON.length == 0) {
                res.redirect('/no-results');
            }
            else {
                setSearchDriverRide(resultJSON, newdate);
                Promise.all(promiseArr).then(function (ps) {
                    renderRide(req, res, ps);
                });
            }
        }).catch(function (err) {
            //TODO voir quel erreur sera donné si un crash (ici normalement, c'est une erreur de prog..)
            log.error(err);
            res.redirect('/no-results');
        });
    }else{
        renderRide(req, res, ps);
    }
};

Ride.prototype.searchPassengers = function (req, res, newdate) {
    var rechercheOption = getTravelOption();

    if(rechercheOption){
        new TravelRequest().where(rechercheOption).query(function (qb) {
            qb.orderBy('departureDate', 'ASC');
        }).fetchAll().then(function (user) {
            var resultJSON = user.toJSON();

            if (resultJSON.length == 0) {
                res.redirect('/no-results');
            }
            else {
                setSearchPassengerRide(resultJSON, newdate);
                Promise.all(promiseArr).then(function (ps) {
                    renderRide(req, res, ps);
                });
            }
        }).catch(function (err) {
            log.error(err);
            res.redirect('/no-results');
        });
    }
    else{
        renderRide(req, res, ps);
    }

};

/*
Setup the result to display when searching for a Driver
@param {jsonObject} resultJSON
 */
function setSearchDriverRide(resultJSON, newdate) {
    for (var indiceElement in resultJSON) {
        var jsonTrip = resultJSON[indiceElement];

        if (newdate <= jsonTrip['departureDate']) {
            //TODO sa cause pas de problème une date et l'utiliser pour elle même dans un type différent?
            date = jsonTrip['departureDate'];
            date = moment(date).format("dddd, Do MMMM YYYY");
            departureDate_arr.push(capitalize(date));

            time = jsonTrip['departureTime'];
            time = moment(time, ["HH:mm"]).format("h:mm A");
            departureTime_arr.push(time);

            idTravel_arr.push(jsonTrip['idAddTravel']);
            driver_arr.push(jsonTrip['driver']);
            luggageSize_arr.push(jsonTrip['luggagesSize']);
            comment_arr.push(jsonTrip['comments']);
            petsAllowed_arr.push(jsonTrip['petsAllowed']);
            seatsAvailable_arr.push(jsonTrip['availableSeat']);
            seatsTaken_arr.push(jsonTrip['takenSeat']);
            cost_arr.push(jsonTrip['cost']);
            promiseArr.push(modelUsers.getUsernameFromDBAsync(jsonTrip['driver']));

        }
    }
}

function setSearchPassengerRide(resultJSON, newdate) {
    for (var indiceElement in resultJSON) {
        var jsonTrip = resultJSON[indiceElement];

        if (newdate <= jsonTrip['departureDate']) {

            date = jsonTrip['departureDate'];
            date = moment(date).format("dddd, Do MMMM YYYY");
            departureDate_arr.push(capitalize(date));

            time = jsonTrip['departureTime'];
            time = moment(time, ["HH:mm"]).format("h:mm A");
            departureTime_arr.push(time);

            idTravel_arr.push(jsonTrip['idAddTravel']);
            passenger_arr.push(jsonTrip['passenger']);
            luggageSize_arr.push(jsonTrip['luggageSize']);
            comment_arr.push(jsonTrip['comments']);
            petsAllowed_arr.push(jsonTrip['pets']);

            promiseArr.push(modelUsers.getUsernameFromDBAsync(jsonTrip['passenger']));
        }
    }
}

function renderRide(req, res, ps) {
    res.render('pages/results.ejs', {
        name : ps,
        idTravel: idTravel_arr,
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
        logged: utils.authentificated(req),
        header: header,
        foot: foot
    });
}

function getTravelOption() {
    var rech = null;
    if(dest && currLocation){
        rech = {
            destinationAddress: dest,
            startAddress: currLocation
        }
    }else if(dest){
        rech = {
            destinationAddress: dest
        }
    }else if(currLocation) {
        rech = {
            startAddress: currLocation
        }
    }

    return rech;
}

function capitalize(str)
{
    var pieces = str.split(" ");
    for ( var i = 0; i < pieces.length; i++ )
    {
        var j = pieces[i].charAt(0).toUpperCase();
        pieces[i] = j + pieces[i].substr(1);
    }
    return pieces.join(" ");
}