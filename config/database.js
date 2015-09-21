/**
 * Created by vasi2401 on 2015-09-18.
 */

var mysql = require('mysql');

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'standard',
    password : 'allo',
    database : 'test'
});

module.exports = {
    dbConnection : connection
};

