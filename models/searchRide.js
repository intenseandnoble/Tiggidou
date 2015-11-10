/**
 * Created by dave on 09/11/15.
 */
var Travel = require('./travel').Travel;
var TravelRequest = require('./travelRequest').TravelRequest;
//View en français
var header = require('../views/fr/header.js');
var foot = require('../views/fr/footer.js');
var utils = require('../controllers/utils.js');

module.exports = Ride;

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
var dest = null;
var currLocation = null;

function Ride(temp_dest, temp_currlocation) {
    dest = temp_dest;
    currLocation = temp_currlocation;
}



Ride.prototype.searchDriver = function (req, res, newdate) {
    new Travel().where({
        destinationAddress: dest,
        startAddress: currLocation
    }).query(function (qb) {
        qb.orderBy('departureDate', 'ASC');
    }).fetchAll().then(function (user) {
        var resultJSON = user.toJSON();

        if (resultJSON.length == 0) {
            res.redirect('/no-results');
        }
        else {
            setSearchDriverRide(resultJSON, newdate);
            renderRide(req, res);
        }
    }).catch(function (err) {
        res.redirect('/no-results');
    });
};

Ride.prototype.searchPassengers = function (req, res, newdate) {
    new TravelRequest().where({
        destinationAddress: dest,
        startAddress: currLocation
    }).query(function (qb) {
        qb.orderBy('departureDate', 'ASC');
    }).fetchAll().then(function (user) {
        var resultJSON = user.toJSON();

        if (resultJSON.length == 0) {
            res.redirect('/no-results');
        }
        else {
            setSearchPassengerRide(resultJSON, newdate);
            renderRide(req, res);
        }


    }).catch(function (err) {
        res.redirect('/no-results');
    });
};

function setSearchDriverRide(resultJSON, newdate) {
    for (i = 0; i < resultJSON.length; i++) {
        if (newdate <= resultJSON[i]['departureDate']) {
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
}

function setSearchPassengerRide(resultJSON, newdate) {
    for (i = 0; i < resultJSON.length; i++) {
        if (newdate <= resultJSON[i]['departureDate']) {
            idTravel_arr.push(resultJSON[i]['idAddTravel']);
            passenger_arr.push(resultJSON[i]['passenger']);
            luggageSize_arr.push(resultJSON[i]['luggageSize']);
            departureTime_arr.push(resultJSON[i]['departureTime']);
            comment_arr.push(resultJSON[i]['comments']);
            petsAllowed_arr.push(resultJSON[i]['pets']);
            departureDate_arr.push(resultJSON[i]['departureDate']);
        }

    }
}

function renderRide(req, res) {
    res.render('pages/results.ejs', {
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