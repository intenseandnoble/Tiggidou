/**
 * Created by dave on 28/09/15.
 */

var DB = require('../config/database').DB;

var Users = DB.Model.extend({
    tableName: 'Users',
    idAttribute: 'idUser'
});

var UsersFacebook = DB.Model.extend({
    tableName: 'UsersFacebook',
    idAttribute: 'idUserFacebook'
})

module.exports = {
    Users: Users,
    UsersFacebook: UsersFacebook
};
