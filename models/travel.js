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

var Travel = DB.Model.extend({
    tableName: 'travel',
    idAttribute: 'idAddTravel'
});

module.exports = {
    Travel : Travel,
    updateSeats: updateSeats,
    displayPageOfATravelwComments:displayPageOfATravelwComments,
    displayPageOfAllTravelsOfUser: displayPageOfAllTravelsOfUser
};

function displayPageOfATravelwComments (req, res) {
    var travelId = req.params.travelId;

    new Travel()
        .where({
            idAddTravel: travelId
        })
        .fetch()
        .then(function (result) {
            if (result) {
                var resultat = result.toJSON();
                resultat['departureDate'] = moment(resultat['departureDate']).format("dddd, Do MMMM YYYY");
                displayPageAndComments(req, res, resultat, travelId);
            }
            else {
                res.redirect('/login');
            }
        });

}

function displayPageOfAllTravelsOfUser (req, res) {
    var ProfileModel = require('./profile');
    var profil = new ProfileModel();
    Promise.join(profil.getTravelsAsDriver(req),
        function (travelsD, travelsP) {

            res.render('pages/all-travels.ejs',
                {
                    logged: utils.authentificated(req),
                    header: header,
                    foot : foot,
                    profile: profile,
                    pageType : 3,

                    allTravels: travelsD

                });
        });
}

function displayPageAndComments (req, res, travel, travelId) {

    var commentsDatePromise = [];
    var commentariesTextsPromise = [];
    var commentsUsernamesPromise = [];

    new Comments().where({
        commentType: 1,
        commentTravelId: travelId
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
            Promise.join(commentariesTextsPromise,
                commentsDatePromise, commentsUsernamesPromise,
                function (commentariesTexts, commentsDate, commentsUsernames) {

                    Promise.all(commentsUsernames)
                        .then(function (cUsernames) {
                            res.render('pages/travel.ejs',
                                {
                                    logged: utils.authentificated(req),
                                    header: header,
                                    foot : foot,
                                    profile: profile,

                                    travel: travel,

                                    typeOfComment: 1,
                                    pageType:1,
                                    comments: commentariesTexts,
                                    commentsIssuers: cUsernames,
                                    commentsDate: commentsDate,
                                    userOfProfile: travelId

                                });
                        });
                });
        });
}



function updateSeats(travelId, takenSeats, availableSeats){

    new Travel().where({
        idAddTravel: travelId
    }).save({
        takenSeat :takenSeats+1,
        availableSeat : availableSeats-1

    }, {method: 'update'}).catch(function (err) {
        log.error(err);
    });

}

