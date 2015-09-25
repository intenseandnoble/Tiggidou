/**
 * Created by vasi2401 on 2015-09-18.
 */

//load the model
var covoso = require(__dirname + '/../app/models/covosocialSearchDepartures');
var express = require('express');


// show routes to app
module.exports = function (app) {


// routes ======================================================================

    // api ---------------------------------------------------------------------
    //single page application
    app.get('/', function (req, res) {
        res.sendFile('/public/html/index.html', {root: './../'});
    });

    // rechercher
    app.get('/api/search', function (req, res) {

        //faire une recherche et afficher son r�sultat

    });

    // login
    app.get('/api/login', function (req, res) {


    });

    // signup
    app.get('/api/signup', function (req, res) {


    });

    //... ajouter plus de fonctionalit�s

};