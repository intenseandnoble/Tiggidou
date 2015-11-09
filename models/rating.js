/**
 * Created by dave on 09/11/15.
 */

var DB = require('../config/database');

var Ratings = DB.Model.extend({
    tableName: 'ratings',
    idAttribute: 'idRating'
});

module.exports = {
    Ratings: Ratings
};