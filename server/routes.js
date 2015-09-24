/**
 * Created by vasi2401 on 2015-09-18.
 */

//load the model
var covoso = require('./../app/models/covosocialSearchDepartures');



// show routes to app
module.exports = function (app) {


// routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all todos
/*
    app.get('/api/todos', function (req, res) {

        // use mongoose to get all todos in the database
        Todo.find(function (err, todos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(todos); // return all todos in JSON format
        });
    });
*/
    //single page application
    app.get('*', function (req, res) {
        res.sendfile('./../public/index.html');
    });

    // rechercher
    app.get('/api/search', function (req, res) {

        //faire une recherche et afficher son résultat

    });

    // login
    app.get('/api/login', function (req, res) {


    });

    // signup
    app.get('/api/signup', function (req, res) {


    });

    //... ajouter plus de fonctionalités

};