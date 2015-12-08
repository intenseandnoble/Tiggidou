/**
 * file for interaction with the table userscore
 */
// for the creation of the connection with the table
var DB = require('../config/database');

//creation of the link between the table userscore of the db and the object Score
var Score = DB.Model.extend({
    tableName: 'userscore',
    idAttribute: 'iduserscore',
    user: function () {
        return this.belongsTo(Users, 'idUser');
    }
});

module.exports = {
    Score : Score
};