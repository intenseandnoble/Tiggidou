/**
 * Created by vasi2401 on 2015-09-18.
 * Hold database connection settings
 */

var mysql = require('mysql');
var Bookshelf = require('bookshelf');

var configConnection = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'CovosocialSchema',
    charset: 'UTF8_GENERAL_CI'
};

var connection = mysql.createConnection(configConnection);

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
});

var DB = Bookshelf.initialize({
    client: 'mysql',
    connection: configConnection
});

module.exports.DB = DB;

exports.dbConnection = connection;

exports.insertRequest = function(req, res){
    connection.query(req, res);
};
