/**
 * class file of Ride
 */
// for the creation of the connection with the table and for the access to other tables of the db
var Travel = require('./travel').Travel;
var TravelRequest = require('./travelRequest').TravelRequest;
var modelUsers = require('./user');
// contains various reusable functions
var utils = require('../controllers/utils.js');
//to handle the change of format of a date
var moment = require('moment');
// to handle promises
var Promise = require('bluebird');
// allows logging of errors
var log = require('../config/logger').log;
//View en français, contains the possibly changing values of strings used in the rendering of pages
var header = require('../views/fr/header.js');
var foot = require('../views/fr/footer.js');
var variousLilStrings = require('../views/fr/variousLilStrings.js');

module.exports = Ride;

var promiseArr;
var date;
var time;
var jsonObject;
var dest;
var currLocation;
var dateRequest;

/**
 * constructor function
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


/**
 * function of class: seeks among the travel offers those corresponding to rechercheOption
 * @param {date} newdate must be a date format
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
        renderRide(req, res, null);
    }
};
/**
 * function of class: seeks among the travel requests those corresponding to rechercheOption
 * @param req
 * @param res
 */
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
        renderRide(req, res, null);
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
/**
 * renders the results of one of the research functions above
 * @param req
 * @param res
 * @param ps
 */
function renderRide(req, res, ps) {

    for(var i =0; i< jsonObject.length;i++)
    {
        jsonObject[i].name = ps[i];
    }

    res.render('pages/results.ejs', {
        name : ps,
        driverBool : req.query.search,
        jsonObject: jsonObject,
        logged: utils.authentificated(req),
        header: header,
        foot: foot,
        strings: variousLilStrings
    });
}
/**
 * seeks options of search from global variables and returns it as a JSON object
 * @returns {*}
 */
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
//TODO put the function below in utils
/**
 * puts a capitalize first letter for each word
 * @param str
 * @returns {string}
 */
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