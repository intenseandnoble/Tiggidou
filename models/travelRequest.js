/**
 * file for interaction with the table searchTravel
 */
// contains various reusable functions
var utils = require('../controllers/utils.js');
// allows logging of errors
var log = require('../config/logger').log;
// to handle promises
var Promise = require('bluebird');
//to handle the change of format of a date
var moment = require('moment');
// the value within parenthesis of locale can be changed to obtain
// the standard format of another location
moment.locale("fr");
moment().format('LLL');
// for the creation of the connection with the table and for the access to other tables of the db
var DB = require('../config/database');
var modelUsers = require('./user');
var Comments = require('./comments').Comments;
// contains the possibly changing values of strings used in the rendering of pages
var header = require('../views/fr/header.js');
var foot = require('../views/fr/footer.js');
var profile = require('../views/fr/profile.js');
//creation of the link between the table searchTravel of the db and the object TravelRequest
var TravelRequest = DB.Model.extend({
    tableName: 'searchtravel',
    idAttribute: 'idSearchTravel'

});
// making available to requires the following variables of this file
module.exports = {
    TravelRequest : TravelRequest,
    displayPageOfAReqTravelwComments: displayPageOfAReqTravelwComments,
    displayPageOfAllTravelsOfUser: displayPageOfAllTravelsOfUser
};
/**
 * for the rendering of the page
 * finds a searchTravel and call the rendering function
 * @param req
 * @param res
 */
function displayPageOfAReqTravelwComments (req, res) {
    var reqTravelId = req.params.reqTravelId;

    new TravelRequest()
        .where({
            idSearchTravel: reqTravelId
        })
        .fetch()
        .then(function (result) {
            if (result) {
                var resultat = result.toJSON();
                resultat['departureDate'] = moment(resultat['departureDate']).format("dddd, Do MMMM YYYY");

                renderingAndPromisesResolution(req, res, resultat, reqTravelId);

            }
            else {
                res.redirect('/login');
            }

        });
}
/**
 * finds all travelRequests of user and renders the page all-travels with it
 * @param req
 * @param res
 */
function displayPageOfAllTravelsOfUser (req, res) {
    var ProfileModel = require('./profile');
    var profil = new ProfileModel();
    Promise.join(profil.getTravelsAsPassenger(req),
        function (travelsP) {

            res.render('pages/all-travels.ejs',
                {
                    logged: utils.authentificated(req),
                    header: header,
                    foot : foot,
                    profile: profile,
                    pageType : 4,

                    allTravels: travelsP

                });
        });
}
/**
 * renders pages after resolving all async calls
 * @param req
 * @param res
 * @param travel
 * @param reqTravelId
 */
function renderingAndPromisesResolution (req, res, travel, reqTravelId) {

    var commentsDatePromise = [];
    var commentariesTextsPromise = [];
    var commentsUsernamesPromise = [];

    new Comments().where({
        commentType: 2,
        commentReqTravelId: reqTravelId
    }).fetchAll()
        .then(function (results) {
            var resultJSON = results.toJSON();

            if (resultJSON.length == 0) {
                //TODO if no comments
            }
            else {
                for (i = 0; i < resultJSON.length; ++i) {
                    commentariesTextsPromise.push(resultJSON[i]['comment']);
                    commentsDatePromise.push(resultJSON[i]['commentDisplayDate']);
                    commentsUsernamesPromise.push(modelUsers.getUsernameFromDBAsync(resultJSON[i]['commentIssuer']));
                }
            }

            Promise.join(commentariesTextsPromise,
                commentsDatePromise, commentsUsernamesPromise,
                function (commentariesTexts, commentsDate, commentsUsernames) {

                    Promise.all(commentsUsernames)
                        .then (function (cUsernames) {
                            new modelUsers.Users().where({idUser: travel.passenger})
                                .fetch()
                                .then(function(user){
                                    res.render('pages/travel.ejs',
                                        {
                                            logged: utils.authentificated(req),
                                            header: header,
                                            foot : foot,
                                            profile: profile,

                                            travel: travel,

                                            typeOfComment: 2,
                                            pageType:2,
                                            comments: commentariesTexts,
                                            commentsIssuers: cUsernames,
                                            commentsDate: commentsDate,
                                            userOfProfile: reqTravelId,

                                            username: user.attributes.username

                                        });
                                });

                        });
                });
        });
}