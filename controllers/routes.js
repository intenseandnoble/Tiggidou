/**
 * Created by vasi2401 on 2015-09-18.
 */

//load the model
var covoso = require(__dirname + '/../models/covosocialSearchDepartures');
var express = require('express');


// show routes to app
module.exports = function (app) {


// routes ======================================================================

    // api ---------------------------------------------------------------------
    //single page application
    app.get('/', function (req, res) {
        res.sendFile('/views/fr/index.html', {root: './'});
    });

    // rechercher
    app.get('/search', function (req, res) {

        //faire une recherche et afficher son r�sultat

    });

    // login
    app.get('/login', function (req, res) {


    });

    // signup
    app.get('/signup', function (req, res) {


    });

    //... ajouter plus de fonctionalit�s

};