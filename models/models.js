/**
 * Created by dave on 09/11/15.
 */

var comments = require('./comments');
var rating = require('./rating');
var travel = require('./travel');
var travelPassenger = require('./travelPassengers');
var travelRequest = require('./travelRequest');
var user = require('./user');

module.exports = {
    Comments: comments.Comments,
    Rating: rating.Ratings,
    Travel: travel.Travel,
    TravelPassenger: travelPassenger.TravelPassengers,
    TravelRequest: travelRequest.TravelRequest,
    Users: user.Users
};

