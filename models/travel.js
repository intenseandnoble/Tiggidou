/**
 * file for the creation of an object equivalent to the table travel
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
var Comments = require('./comments').Comments;
var modelUsers = require('./user');
// contains the possibly changing values of strings used in the rendering of pages
var header = require('../views/fr/header.js');
var foot = require('../views/fr/footer.js');
var profile = require('../views/fr/profile.js');
//creation of the link between the table travel of the db and the object Travel
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
/**
 * finds a Travel and call the rendering function
 * @param req
 * @param res
 */
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
                renderingAndPromisesResolution(req, res, resultat, travelId);
            }
            else {
                res.redirect('/login');
            }
        });

}
/**
 * finds all travels of user and renders the page all-travels with it
 * @param req
 * @param res
 */
function displayPageOfAllTravelsOfUser (req, res) {
    var ProfileModel = require('./profile');
    var profil = new ProfileModel();
    Promise.join(profil.getTravelsAsDriver(req),
        function (travelsD) {

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
/**
 * renders pages after resolving all async calls
 * @param req
 * @param res
 * @param travel
 * @param travelId
 */
function renderingAndPromisesResolution (req, res, travel, travelId) {
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
                            new modelUsers.Users().where({idUser: travel.driver})
                                .fetch()
                                .then(function(user){
                                    res.render('pages/travelInformation.ejs',
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
                                            userOfProfile: travelId,

                                            username: user.attributes.username

                                        });
                                });

                        });
                });
        });
}


/**
 * update the number of taken/available seats
 * @param travelId
 * @param takenSeats
 * @param availableSeats
 */
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

