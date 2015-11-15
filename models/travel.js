/**
 * Created by dave on 09/11/15.
 */
var log = require('../config/logger').log;
var DB = require('../config/database');

var Travel = DB.Model.extend({
    tableName: 'travel',
    idAttribute: 'idAddTravel'
});

module.exports = {
    Travel : Travel,
    updateSeats: updateSeats
};

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