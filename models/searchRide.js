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

function Ride() {
}

Ride.prototype.idTravel_arr = [];
Ride.prototype.driver_arr = [];
Ride.prototype.passenger_arr=[];
Ride.prototype.comment_arr = [];
Ride.prototype.seatsTaken_arr = [];
Ride.prototype.seatsAvailable_arr = [];
Ride.prototype.travelTime_arr = [];
Ride.prototype.departureTime_arr = [];
Ride.prototype.departureDate_arr = [];
Ride.prototype.luggageSize_arr = [];
Ride.prototype.petsAllowed_arr = [];
Ride.prototype.cost_arr = [];
Ride.prototype.dest = null;
Ride.prototype.currLocation = null;

Ride.prototype.searchDriver = function (req, res, newdate) {
    new Travel().where({
        destinationAddress: this.dest,
        startAddress: this.currLocation
    }).query(function (qb) {
        qb.orderBy('departureDate', 'ASC');
    }).fetchAll().then(function (user) {

        var resultJSON = user.toJSON();

        if (resultJSON.length == 0) {
            res.redirect('/no-results');
        }
        else {

            for (i = 0; i < resultJSON.length; i++) {

                if (newdate <= resultJSON[i]['departureDate']) {
                    this.idTravel_arr.push(resultJSON[i]['idAddTravel']);
                    this.driver_arr.push(resultJSON[i]['driver']);
                    this.luggageSize_arr.push(resultJSON[i]['luggagesSize']);
                    this.departureTime_arr.push(resultJSON[i]['departureTime']);
                    this.comment_arr.push(resultJSON[i]['comments']);
                    this.petsAllowed_arr.push(resultJSON[i]['petsAllowed']);
                    this.departureDate_arr.push(resultJSON[i]['departureDate']);
                    this.seatsAvailable_arr.push(resultJSON[i]['availableSeat']);
                    this.seatsTaken_arr.push(resultJSON[i]['takenSeat']);
                    this.cost_arr.push(resultJSON[i]['cost']);
                }
            }

            renderRide(req, res);
        }
    }).catch(function (err) {
        res.redirect('/no-results');
    });
};

Ride.prototype.searchPassengers = function (req, res, newdate) {
    new TravelRequest().where({
        destinationAddress: this.dest,
        startAddress: this.currLocation
    }).query(function (qb) {
        qb.orderBy('departureDate', 'ASC');
    }).fetchAll().then(function (user) {

        var resultJSON = user.toJSON();

        if (resultJSON.length == 0) {
            res.redirect('/no-results');
        }
        else {

            for (i = 0; i < resultJSON.length; i++) {

                if (newdate <= resultJSON[i]['departureDate']) {
                    this.idTravel_arr.push(resultJSON[i]['idAddTravel']);
                    this.passenger_arr.push(resultJSON[i]['passenger']);
                    this.luggageSize_arr.push(resultJSON[i]['luggageSize']);
                    this.departureTime_arr.push(resultJSON[i]['departureTime']);
                    this.comment_arr.push(resultJSON[i]['comments']);
                    this.petsAllowed_arr.push(resultJSON[i]['pets']);
                    this.departureDate_arr.push(resultJSON[i]['departureDate']);
                }

            }

            renderRide(req, res);
        }


    }).catch(function (err) {
        res.redirect('/no-results');
    });
}

function renderRide(req, res) {
    res.render('pages/results.ejs', {
        idTravel: this.idTravel_arr,
        drivers: this.driver_arr,
        passengers: this.passenger_arr,
        comment: this.comment_arr,
        seatsTaken: this.seatsTaken_arr,
        seatsAvailable: this.seatsAvailable_arr,
        travelTime: this.travelTime_arr,
        departureTime: this.departureTime_arr,
        departureDate: this.departureDate_arr,
        luggageSize: this.luggageSize_arr,
        petsAllowed: this.petsAllowed_arr,
        cost: this.cost_arr,
        destination: this.dest,
        currentLocation: this.currLocation,
        logged: utils.authentificated(req),
        header: header,
        foot: foot
    });
}