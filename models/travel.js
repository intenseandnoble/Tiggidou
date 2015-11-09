/**
 * Created by dave on 09/11/15.
 */

var DB = require('../config/database');

var Travel = DB.Model.extend({
    tableName: 'travel',
    idAttribute: 'idAddTravel'
});

module.exports = {
    Travel : Travel
};