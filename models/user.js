/**
 * Created by dave on 28/09/15.
 */

var DB = require('../config/database').DB;

var Users = DB.Model.extend({
    tableName: 'Users',
    idAttribute: 'idUser'
});


module.exports = {
    Users: Users
};
