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
    Users: Users,
    getUserName: getUserName,
    getUsernameFromDBAsync: getUsernameFromDBAsync
};

function getUserName(id){

    var firstName = "Unknown";

    var finishRequest = function () {return firstName;};

    new Model.Users({idUser: id}).fetch().then(function (model) {
        firstName = model.get('firstName');
        console.log(id + " : " + firstName);
        finishRequest();
    });
}

function getUsernameFromDBAsync(userId) {

    return new Users({
        idUser: userId
    })
        .fetch()
        .then(function(u){
            var prenom = u.get('firstName');
            var nom = u.get('familyName');
            var s = prenom + " " + nom;
            return s;
        });
}


