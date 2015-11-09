/**
 * Created by dave on 09/11/15.
 */


var DB = require('../config/database');

var TravelPassengers = DB.Model.extend({
    tableName: 'travelpassengers'
});

module.exports = {
    TravelPassengers : TravelPassengers,
    add: addTravelPassenger
};


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