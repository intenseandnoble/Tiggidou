/**
 * File for interaction with the table users in the database
 *
 */
var log = require('../config/logger').log;
var DB = require('../config/database');

/**
 * a model for users
 */
var Users = DB.Model.extend({
    tableName: 'users',
    idAttribute: 'idUser',
    comments: function() {
        return this.hasMany(Comments, 'commentIssuer');
    },
    score: function() {
        return this.hasOne(Score, 'userId');
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
    },
    getUsernames: function(partialUsername) {
        return DB.knex('users')
            .where('username', 'like', partialUsername)
            .then(function (result) {
                var uns = [];
                for (var i = 0; i<result.length; ++i) {
                    uns.push(result[i].username);
                }
                return uns;
            })
    }
});

module.exports = {
    Users: Users,
    getUsernameFromDBAsync: getUsernameFromDBAsync
};

/**
 * Seeks in the db the user corresponding to userId and returns its username asynchronously
 * @param userId
 */
function getUsernameFromDBAsync(userId) {

    return new Users({
        idUser: userId
    })
        .fetch()
        .then(function(u){
            /*
            var prenom = u.get('firstName');
            var nom = u.get('familyName');
            var s = prenom + " " + nom;
            */
            return u.get('username');
        })
        .catch(function(err){
            log.error(err);
        });
}


