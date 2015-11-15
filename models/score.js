/**
 * Created by Ian on 11/14/2015.
 */
var DB = require('../config/database');


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