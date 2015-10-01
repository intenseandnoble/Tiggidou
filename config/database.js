/**
 * Created by vasi2401 on 2015-09-18.
 * Hold database connection settings
 */

var mysql = require('mysql');

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'CovosocialSchema'
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
});

exports.dbConnection = connection;

exports.insertRequest = function(req, res){
    connection.query(req, res);
    connection.end();
}
