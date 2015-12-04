/**
 * file for the creation of an object equivalent to the table ratings
 */
// allows logging of errors
var log = require('../config/logger').log;
// for the creation of the connection with the table
var DB = require('../config/database');
//creation of the link between the table ratings of the db and the object Ratings
var Ratings = DB.Model.extend({
    tableName: 'ratings',
    idAttribute: 'idRating'
});

module.exports = {
    Ratings: Ratings
};