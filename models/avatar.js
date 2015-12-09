/**
 * file for interaction with the table users
 */
// for the creation of the connection with the table
var DB = require('../config/database');

//creation of the link between the table userscore of the db and the object Score
var avatar = DB.Model.extend({
    tableName: 'users',
    idAttribute: 'avatar',
    user: function () {
        return this.belongsTo(Users, 'idUser');
    }
});

module.exports = {
    avatar : avatar
};