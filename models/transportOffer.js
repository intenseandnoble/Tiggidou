/**
 * Created by dave on 26/11/15.
 */
var log = require('../config/logger').log;
var DB = require('../config/database');

var TransportOffer = DB.Model.extend({
    tableName: 'transportoffer',
    idAttribute: 'idAddTravel'
});

module.exports = {
    TransportOffer : TransportOffer
};