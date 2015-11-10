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
            Promise.all(promiseArr).then(function (ps) {
                renderRide(req, res, ps);
            });
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
            Promise.all(promiseArr).then(function (ps) {
                renderRide(req, res, ps);
            });
        }


    }).catch(function (err) {
        res.redirect('/no-results');
    });
};

function setSearchDriverRide(resultJSON, newdate) {
    for (i = 0; i < resultJSON.length; i++) {
        if (newdate <= resultJSON[i]['departureDate']) {

            date = resultJSON[i]['departureDate'];
            date = moment(date).format("dddd, Do MMMM YYYY");
            departureDate_arr.push(capitalize(date));

            time = resultJSON[i]['departureTime'];
            time = moment(time, ["HH:mm"]).format("h:mm A");
            departureTime_arr.push(time);

            idTravel_arr.push(resultJSON[i]['idAddTravel']);
            driver_arr.push(resultJSON[i]['driver']);
            luggageSize_arr.push(resultJSON[i]['luggagesSize']);
            comment_arr.push(resultJSON[i]['comments']);
            petsAllowed_arr.push(resultJSON[i]['petsAllowed']);
            seatsAvailable_arr.push(resultJSON[i]['availableSeat']);
            seatsTaken_arr.push(resultJSON[i]['takenSeat']);
            cost_arr.push(resultJSON[i]['cost']);
            promiseArr.push(modelUsers.getUsernameFromDBAsync(resultJSON[i]['driver']));
        }
    }
}

function setSearchPassengerRide(resultJSON, newdate) {
    for (i = 0; i < resultJSON.length; i++) {
        if (newdate <= resultJSON[i]['departureDate']) {

            date = resultJSON[i]['departureDate'];
            date = moment(date).format("dddd, Do MMMM YYYY");
            departureDate_arr.push(capitalize(date));

            time = resultJSON[i]['departureTime'];
            time = moment(time, ["HH:mm"]).format("h:mm A");
            departureTime_arr.push(time);

            idTravel_arr.push(resultJSON[i]['idAddTravel']);
            passenger_arr.push(resultJSON[i]['passenger']);
            luggageSize_arr.push(resultJSON[i]['luggageSize']);
            comment_arr.push(resultJSON[i]['comments']);
            petsAllowed_arr.push(resultJSON[i]['pets']);

            promiseArr.push(modelUsers.getUsernameFromDBAsync(resultJSON[i]['passenger']));
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