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
        res.sendFile('/views/fr/login.html', {root: './'})
    });



    // signup
    app.get('/signup', function (req, res) {


    });


    app.get('/results', function (req, res) {
        res.sendFile('/views/fr/results.html', {root: './'})
    });

    app.get('/no-results', function (req, res) {
        res.sendFile('/views/fr/no-results.html', {root: './'})
    });

    app.get('/ask-ride', function (req, res) {
        res.sendFile('/views/fr/ask-ride.html', {root: './'})
    });
    //... ajouter plus de fonctionalit�s

};
