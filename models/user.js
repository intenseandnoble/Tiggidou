/**
 * Created by dave on 28/09/15.
 */
var log = require('../config/logger').log;
var DB = require('../config/database');

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


