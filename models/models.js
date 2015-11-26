/**
 * Created by dave on 09/11/15.
 */

var comments = require('./comments');
var rating = require('./rating');
var transportOffer = require('./transportOffer');
var travel = require('./travel');
var travelPassenger = require('./travelPassengers');
var travelRequest = require('./travelRequest');
var user = require('./user');
var score = require('./score');

module.exports = {
    ModelComments: comments,
    ModelRating: rating,
    ModelScore: score,
    ModelTransportOffer: transportOffer,
    ModelTravel: travel,
    ModelTravelPassenger: travelPassenger,
    ModelTravelRequest: travelRequest,
    ModelUsers: user
};

