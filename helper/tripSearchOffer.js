/**
 * Created by dave on 29/11/15.
 */

//View en français
var headerFR = require('../views/fr/header.js');
var footFR = require('../views/fr/footer.js');
var variousLilStrings = require('../views/fr/variousLilStrings.js');
var profileFR = require('../views/fr/profile');
//Models and utils
var utils = require('../controllers/utils.js');
var log = require('../config/logger').log;
var profile = require('../models/profile.js');
var Model = require('../models/models');
var TravelRequest = require('../models/travelRequest').TravelRequest;

module.exports = TripSearchOffer;

var userId;

function TripSearchOffer(idUser){
    userId = idUser;
}

TripSearchOffer.prototype.display = function(req, res){
    //Get search transport from this actual user
    new TravelRequest()
        .query({where:{passenger: userId}})
        .fetchAll()
        .then(function(listSearchTravel){
            getOfferTransportInformation(listSearchTravel.models, function(err, resultsProposition){
                if(err){
                    log.error(err);
                    return res.redirect('/no-results');
                }

                res.render('pages/transportOffer.ejs',
                    {
                        logged: utils.authentificated(req),
                        header: headerFR,
                        foot : footFR,
                        strings: variousLilStrings,
                        profile: profileFR,
                        pageType: 5,
                        proposition: resultsProposition
                    })
            });
        });
};

function getOfferTransportInformation(listToSearch, done) {
    var resultsProposition = [];
    listToSearch.forEach(function (travel, indice, array) {
        var idSearchTransport = travel.attributes.idSearchTravel;

        //get every proposition of transport
        new Model.ModelTransportOffer.TransportOffer()
            .query({where: {idSearchTravel: idSearchTransport}})
            .fetchAll()
            .then(function (propositionTrip) {
                if (propositionTrip.models.length > 0) {
                    setInformationTrip(propositionTrip.models, function(err, listInformation){
                        if(err){
                            log.error(err);
                            return res.redirect('/no-results');
                        }
                        resultsProposition.push({
                            searchID: idSearchTransport,
                            offer: listInformation
                        });

                        if(indice+1 == listToSearch.length){
                            return done(null, resultsProposition);
                        }
                    })
                } else{
                    if(indice+1 == listToSearch.length){
                        return done(null, resultsProposition);
                    }
                }


            });
    });
}

function setInformationTrip(propositionTrip, done) {
    var tripInformationList = [];
    //get the proposition information
    propositionTrip.forEach(function (proposition, index, array) {
        new Model.ModelTravel.Travel()
            .query({where:{idAddTravel: proposition.attributes.idTravel}})
            .fetch()
            .then(function (tripInformation) {
                tripInformationList.push(tripInformation);
                if(index + 1 == propositionTrip.length){
                    return done(null, tripInformationList);
                }
            });
    });
}
