/**
 * Created by dave on 09/11/15.
 */
var log = require('../config/logger').log;
var DB = require('../config/database');

var Ratings = DB.Model.extend({
    tableName: 'ratings',
    idAttribute: 'idRating'
});

module.exports = {
    Ratings: Ratings
};