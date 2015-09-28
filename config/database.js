/**
 * Created by vasi2401 on 2015-09-18.
 * Hold database connection settings
 */

var mysql = require('mysql')
var async = require('async')

var PROD_DB = 'app_prod_database'
var TEST_DB = 'app_test_database'

exports.MODE_PROD = 'mode_production'
exports.MODE_TEST = 'mode_test'

var state = {
    pool: null,
    mode: null,
}
 
 exports.connect = function(mode, done){
   state.pool = mysql.createPool({
 	   host : 'localhost',
       user : 'root',
       password : '',
       database : mode === exports.MODE_PROD ? PROD_DB : TEST_DB
   })
   state.mode = mode
   done()
}

exports.get = function(){
 	return state.pool
}
//takes JSON object and loads datas into db, for test
exports.fixtures = function(data){
    var pool = state.pool
    if(!pool)
        return done(new Error('Missing database connection.'))
    var names = Object.keys(data.tables)
    async.each(names, function(name,cb){
       async.each(data.tables[name], function(row,cb){
            var keys = Object.keys(row),
                values = keys.map(function(key){return "'" + row[key] + "'"})
            pool.query('INSERT INTO ' + name + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')', cb)
        }, cb)
    }, done)
}
//clear the data of choosen table, help to clear test_db
exports.drop = function(tables, done) {
    var pool = state.pool
    if (!pool) return done(new Error('Missing database connection.'))
    async.each(tables, function(name, cb) {
        pool.query('DELETE * FROM ' + name, cb)
    }, done)
}
/*
 var connection = mysql.createConnection({
     host : 'localhost',
     user : 'standard',
     password : 'allo',
     database : 'test'
 });
 
exports.dbConnection = connection;