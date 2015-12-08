/**
 * file for the interaction with the table travelpassengers
 */
// allows logging of errors
var log = require('../config/logger').log;
// for the creation of the connection with the table
var DB = require('../config/database');
// creation of the object equivalent of travelpassengers
var TravelPassengers = DB.Model.extend({
    tableName: 'travelpassengers'
});

module.exports = {
    TravelPassengers : TravelPassengers,
    add: addTravelPassenger
};

/**
 * adds a passenger to a travel
 * @param travelId
 * @param userId
 */
function addTravelPassenger(travelId, userId){
    new TravelPassengers().save({
            passenger:userId,
            travel : travelId
        },
        {method: 'insert'}
    ).catch(function (err) {
            log.error(err);
        });
}