/**
 * Created by dave on 28/09/15.
 */

var DB = require('../config/database');

var Users = DB.Model.extend({
    tableName: 'Users',
    idAttribute: 'idUser'
});

var Ratings = DB.Model.extend({
    tableName: 'ratings',
    idAttribute: 'idRating'
});


var Travel = DB.Model.extend({
   tableName: 'travel',
   idAttribute: 'idAddTravel'

});

module.exports = {
    Users: Users,
    ratings: Ratings,
    travel : Travel
};
