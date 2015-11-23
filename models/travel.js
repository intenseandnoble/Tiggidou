/**
 * Created by dave on 09/11/15.
 */
var utils = require('../controllers/utils.js');
var log = require('../config/logger').log;
var DB = require('../config/database');
var Promise = require('bluebird');

var Comments = require('./comments').Comments;
var ProfileModel = require('./profile');

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
    displayPageOfATravelwComments:displayPageOfATravelwComments
};

function displayPageOfATravelwComments (req, res) {
    var travelId = req.params.travelId;

    var travelPromise;
    var commentsPromise;

    var commentsDatePromise;
    var commentariesTextsPromise;
    var commentsUsernamesPromise;

    travelPromise = new Travel()
        .where({
            idAddTravel:travelId
        })
        .fetch();

    commentsPromise =  new Comments().where({
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
        });
    var ProfileModel = require('./profile');
    Promise.join(travelPromise, commentsPromise, ProfileModel.getTravelsAsDriver(req), ProfileModel.getTravelsAsPassenger(req),
        function (travel, comments, travelsD, travelsP) {
        res.render('pages/travel.ejs',
            {
                logged: utils.authentificated(req),
                header: header,
                foot : foot,
                profile: profile,

                travelsAsDriver: travelsD,
                travelsAsPassenger: travelsP,

                pageType:1,
                comments: commentariesTextsPromise,
                commentsIssuers: commentsUsernamesPromise,
                commentsDate: commentsDatePromise,
                userOfProfile: travelId

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

