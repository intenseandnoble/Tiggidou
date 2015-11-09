/**
 * Created by dave on 09/11/15.
 */


var DB = require('../config/database');

var TravelRequest = DB.Model.extend({
    tableName: 'searchtravel',
    idAttribute: 'idSearchTravel'

});

module.exports = {
    TravelRequest : TravelRequest
};