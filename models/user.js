/**
 * Created by dave on 28/09/15.
 */

var DB = require('../config/database');

var Users = DB.Model.extend({
    tableName: 'users',
    idAttribute: 'idUser',
    comments: function() {
        return this.hasMany(Comments, 'commentIssuer');
    },
    getCountName: function(firstName, familyName){
        return DB.knex('users')
            .where({
                "firstName":firstName,
                "familyName": familyName
            })
            .count("idUser")
            .then(function(count){
                return count;
            })
    }
});

var Ratings = DB.Model.extend({
    tableName: 'ratings',
    idAttribute: 'idRating'
});


var Travel = DB.Model.extend({
    tableName: 'travel',
    idAttribute: 'idAddTravel',


});

var TravelRequest = DB.Model.extend({
    tableName: 'searchTravel',
    idAttribute: 'idSearchTravel'

});

var TravelPassengers = DB.Model.extend({
    tableName: 'travelpassengers'


});




var Comments = DB.Model.extend({
    tableName: 'comments',
    idAttribute: 'commentId',
    user: function () {
        return this.belongsTo(Users, 'idUser');
    }
});

module.exports = {
    Users: Users,
    ratings: Ratings,
    Travel : Travel,
    TravelRequest : TravelRequest,
    TravelPassengers : TravelPassengers,
    comments: Comments


};
