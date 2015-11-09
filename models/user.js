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

module.exports = {
    Users: Users
};
