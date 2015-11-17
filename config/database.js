/**
 * Created by vasi2401 on 2015-09-18.
 * Hold database connection settings
 */

var configConnectionDev = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'covosocialschema',
    charset: 'UTF8_GENERAL_CI'
};
var configConnectionProd = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'covosocialschema',
    charset: 'UTF8_GENERAL_CI'
};

var mysql = require('mysql');
var Knex = require('knex')({
    client: 'mysql',
    connection: process.env.NODE_ENV == "prod" ? configConnectionProd : configConnectionDev
});
var Bookshelf = require('bookshelf')(Knex);

module.exports = Bookshelf;

/*
var connection = mysql.createConnection(configConnection);

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);

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
*/