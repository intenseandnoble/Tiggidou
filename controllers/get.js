/**
 * Created by dave on 09/11/15.
 */
//View en français
var headerFR = require('../views/fr/header.js');
var footFR = require('../views/fr/footer.js');
var loginStringFR = require('../views/fr/sign.js');

//Models and utils
var utils = require('./utils.js');
var log = require('../config/logger').log;
var searchRide = require('../models/searchRide.js');
var profile = require('../models/profile.js');
var Model = require('../models/models');
var moment = require('moment');
var Travel = require('../models/travel');
var TravelRequest = require('../models/travelRequest');
var Promise = require('bluebird');

module.exports = {
    getIndex: getHome,
    getProfile: getProfile,
    getSearchRide: getSearchRide,
    getSelectedPassenger:getSelectedPassenger,
    getLogin: getLogin,
    getSignUp: getSignUp,
    getAskRide: getAskRide,
    getResults: getResults,
    getNoResult: getNoResult,
    getLogout: getLogout,
    getTravel: getTravel,
    getTravelRequest: getTravelRequest,
    getCreateFastTravel: getCreateFastTravel,
    getAllTravels: getAllTravels,
    getAllTravelRequests: getAllTravelRequests,
    getPropositionTransport: getPropositionTransport
};

function getHome(req, res) {
    res.render('pages/index.ejs',
        {
            logged: utils.authentificated(req),
            header: headerFR,
            foot : footFR
        });
}



function getProfile(req, res){
    //Todo prendre les donnees de l'utilisateur connecte
    //Todo faire en sorte qu'un vote soit pris en compte par le serveur/bd
    var userSession = req.session.req.user;
    var usernameParams = req.params.username;
    var profileDisplay = new profile();

    var page;
    if (usernameParams == userSession.attributes.username || usernameParams == undefined) {
        page = 'pages/my-profile.ejs';

        new Model.ModelUsers.Users()
            .where({'username': userSession.attributes.username })
            .fetch()
            .then(function(user) {
                if(user) {
                    profileDisplay.setUserValue(user);
                    profileDisplay.displayProfile(req, res, page);
                }
                else{
                    res.redirect('/login');
                }
            });

    } else {
        page = 'pages/profile.ejs';

        new Model.ModelUsers.Users()
            .where({'username': usernameParams})
            .fetch()
            .then(function(user) {
                if(user) {
                    profileDisplay.setUserValue(user);
                    profileDisplay.displayProfile(req, res, page);
                }
                else{
                    res.redirect('/login');
                }
            });

    }


}



function getSearchRide(req, res) {
    var ride = new searchRide(req.query.destination, req.query.currentLocation, req.query.datepicker);

    if(req.query.searchDriver == "on") {
        ride.searchDriver(req, res);
    }
    else {
        ride.searchPassengers(req, res);
    }

}


function getSelectedPassenger(req, res) {
    //TODO What if 2 users add it at the same time? With only 1 place left? Revisit this
    var idUser = req.session.req.user.attributes.idUser;
    var travelPassengerJson = JSON.parse(req.query.jsonObject);
    var date = moment(travelPassengerJson['departureDate'], "dddd, Do MMMM YYYY").format('YYYY-MM-DD');
    var search = {
        driver: idUser,
        startAddress: travelPassengerJson['startAddress'],
        destinationAddress: travelPassengerJson['destinationAddress'],
        departureDate: date
    };
    new Model.ModelTravel.Travel()
        .query({where:search})
        .fetchAll()
        .then(function(travels){
            var travelOffer = travels.toJSON();
            res.render('pages/selectPassenger.ejs',
                {
                    logged: utils.authentificated(req),
                    header: headerFR,
                    foot : footFR,
                    passengerSearch: travelPassengerJson,
                    driverOffer: travelOffer
                });
        })
        .catch(function(err){
            log.error(err);
        });
}

function getCreateFastTravel(req,res){
    var travelPassengerJson = JSON.parse(req.query.jsonObject);
    travelPassengerJson['departureDate'] = moment(travelPassengerJson['departureDate'],"dddd, Do MMMM YYYY").format("DD/MM/YYYY");

    res.render('pages/fastRideOffer.ejs',
        {
            logged: utils.authentificated(req),
            header: headerFR,
            foot : footFR,
            travelResearch: travelPassengerJson
        });

}

function getLogin(req, res) {
    if(req.user){
        res.redirect('/');
    }
    else{
        res.render('pages/login.ejs',
            {
                logged: utils.authentificated(req),
                login: loginStringFR,
                header: headerFR,
                foot : footFR,
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
            login: loginStringFR,
            header: headerFR,
            foot : footFR,
            message: req.flash('signupMessage')
        });
}

function getAskRide (req, res) {
    res.render('pages/ask-ride.ejs',
        {
            logged: utils.authentificated(req),
            header: headerFR,
            foot : footFR
        });
}
function getResults(req, res) {
    res.render('pages/results.ejs',
        {
            logged: utils.authentificated(req),
            header: headerFR,
            foot : footFR
        });
}

function getNoResult(req, res) {
    res.render('pages/no-results.ejs',
        {
            logged: utils.authentificated(req),
            header: headerFR,
            foot : footFR
        });
}
function getLogout(req, res){
    if (req.isAuthenticated()){
        req.logout();
    }

    res.redirect('/');
}

function getTravel(req, res) {

    Travel.displayPageOfATravelwComments(req,res);

}

function getAllTravels(req, res) {

    Travel.displayPageOfAllTravelsOfUser(req,res);

}

function getTravelRequest(req, res) {

    TravelRequest.displayPageOfAReqTravelwComments(req, res);

}

function getAllTravelRequests(req, res) {

    TravelRequest.displayPageOfAllTravelsOfUser(req, res);

}

function getPropositionTransport(req, res){
    var userId = req.user.id;
    var resultsProposition = [];
    new Model.ModelTravelRequest.TravelRequest({passenger: userId}).fetchAll()
        .then(function(listSearchTravel){
            var promiseArr = [];
            var listToSearch = listSearchTravel.models;
            listToSearch.forEach(function(travel){
                var idSearchTransport = travel.attributes.idSearchTravel;
                promiseArr.push(new Model.ModelTransportOffer.TransportOffer({idSearchTravel:idSearchTransport})
                    .fetchAll()
                    .then(function(results){
                        resultsProposition.push({
                            searchID: idSearchTransport,
                            offer: results
                        });
                    }))
            });
            Promise.all(promiseArr).then(function(doc){
                res.render('pages/transportOffer.ejs',
                    {
                        logged: utils.authentificated(req),
                        profile: require('../views/fr/profile.js'),
                        header: headerFR,
                        foot : footFR
                    })
            });

        });


}
