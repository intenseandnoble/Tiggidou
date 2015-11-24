/**
 * Created by dave on 09/11/15.
 */
var utils = require('../controllers/utils.js');
var log = require('../config/logger').log;
var DB = require('../config/database');
var Promise = require('bluebird');
var moment = require('moment');
var modelUsers = require('./user');
moment.locale("fr");
moment().format('LLL');

var Comments = require('./comments').Comments;

var header = require('../views/fr/header.js');
var foot = require('../views/fr/footer.js');
var profile = require('../views/fr/profile.js');

var TravelRequest = DB.Model.extend({
    tableName: 'searchtravel',
    idAttribute: 'idSearchTravel'

});

module.exports = {
    TravelRequest : TravelRequest,
    displayPageOfAReqTravelwComments: displayPageOfAReqTravelwComments
};

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

                displayPageandComments(req, res, resultat, reqTravelId);

            }
            else {
                res.redirect('/login');
            }

        });
}

function displayPageandComments (req, res, travel, reqTravelId) {

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

            var ProfileModel = require('./profile');
            var profil = new ProfileModel();
            Promise.join(profil.getTravelsAsDriver(req), profil.getTravelsAsPassenger(req), commentariesTextsPromise,
                commentsDatePromise, commentsUsernamesPromise,
                function (travelsD, travelsP, commentariesTexts, commentsDate, commentsUsernames) {

                    Promise.all(commentsUsernames)
                        .then (function (cUsernames) {
                            res.render('pages/travel.ejs',
                                {
                                    logged: utils.authentificated(req),
                                    header: header,
                                    foot : foot,
                                    profile: profile,

                                    travelsAsDriver: travelsD,
                                    travelsAsPassenger: travelsP,

                                    travel: travel,

                                    typeOfComment: 2,
                                    pageType:2,
                                    comments: commentariesTexts,
                                    commentsIssuers: cUsernames,
                                    commentsDate: commentsDate,
                                    userOfProfile: reqTravelId

                                });
                        });
                });
        });
}