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

var promiseArr;
var date;
var time;
var jsonObject;
var dest;
var currLocation;
var dateRequest;

/*
 * @param {string} temp_dest Valid address
 * @param {string} temp_currlocation Valid address
 * @error
 */
function Ride(temp_dest, temp_currlocation, temp_date) {

    dest = temp_dest;
    currLocation = temp_currlocation;
    dateRequest = moment(temp_date, "DD-MM-YYYY").format("YYYY-MM-DD");
    if(!dateRequest || dateRequest == 'undefined' || dateRequest == "Invalid date"){
        dateRequest = moment().format("YYYY-MM-DD");
    }

    promiseArr = [];
    date = null;
    time = null;

    moment.locale("fr");
    moment().format('LLL');
}


/*

@param {date} newdate must be a date format
 */
Ride.prototype.searchDriver = function (req, res) {
    var rechercheOption = getTravelOption();

    if(rechercheOption){
        new Travel().where(rechercheOption).query(function (qb) {
            qb.orderBy('departureDate', 'ASC');
        }).fetchAll().then(function (user) {
            var resultJSON = user.toJSON();
            jsonObject = user.toJSON();
            if (resultJSON.length == 0) {
                res.redirect('/no-results');
            }
            else {
                setSearchRide(resultJSON, true);
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

Ride.prototype.searchPassengers = function (req, res) {
    var rechercheOption = getTravelOption();

    if(rechercheOption){
        new TravelRequest().where(rechercheOption).query(function (qb) {
            qb.orderBy('departureDate', 'ASC');
        }).fetchAll().then(function (user) {
            var resultJSON = user.toJSON();
            jsonObject = user.toJSON();

            if (resultJSON.length == 0) {
                res.redirect('/no-results');
            }
            else {
                setSearchRide(resultJSON, false);
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
function setSearchRide(resultJSON,driver_bool ) {
    for (var indiceElement in resultJSON) {
        var jsonTrip = resultJSON[indiceElement];

        date = jsonTrip['departureDate'];
        date = moment(date).format("dddd, Do MMMM YYYY");
        jsonObject[indiceElement]['departureDate'] =capitalize(date);

        time = jsonTrip['departureTime'];
        time = moment(time, ["HH:mm"]).format("h:mm");
        jsonObject[indiceElement]['departureTime'] =time;

        if(driver_bool)
            promiseArr.push(modelUsers.getUsernameFromDBAsync(jsonTrip['driver']));
        else
            promiseArr.push(modelUsers.getUsernameFromDBAsync(jsonTrip['passenger']));

    }
}


function renderRide(req, res, ps) {
    res.render('pages/results.ejs', {
        name : ps,
        driverBool : req.query.searchDriver,
        jsonObject: jsonObject,
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
            startAddress: currLocation,
            departureDate: dateRequest
        }
    }else if(dest){
        rech = {
            destinationAddress: dest,
            departureDate: dateRequest
        }
    }else if(currLocation) {
        rech = {
            startAddress: currLocation,
            departureDate: dateRequest
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