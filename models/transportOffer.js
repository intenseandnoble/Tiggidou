/**
 * file for the creation of an object equivalent to the table transportoffer
 */
// allows logging of errors
var log = require('../config/logger').log;
// for the creation of the connection with the table
var DB = require('../config/database');

var TransportOffer = DB.Model.extend({
    tableName: 'transportoffer',
    idAttribute: 'idAddTravel'
});

module.exports = {
    TransportOffer : TransportOffer
};