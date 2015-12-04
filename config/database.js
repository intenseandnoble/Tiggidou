/**
 * Created by Ian Oscar Vasquez on 2015-09-18.
 * Hold database connection settings
 */
var config = require("./config").Config;

var configConnectionDev = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'covosocialschema',
    charset: 'UTF8_GENERAL_CI'
};
//Will need to have a password when in reel production
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
    connection: config.env == "prod" ? configConnectionProd : configConnectionDev
});
var Bookshelf = require('bookshelf')(Knex);

module.exports = Bookshelf;