/**
 * Created by Mythian on 9/30/2015.
 */
var covoso = require(__dirname + '/../models/covosocialSearchDepartures');
var express = require('express');



module.exports = function (app) {

    var bodyParser = require('body-parser');

    app.use( bodyParser.json() ); // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({ extended: true }));

    app.post('/post-ride', function (req, res) {

        res.send('Data: ' + req.body.currentLocation);

        console.log(req.body);

        insert_into_searchTravel(req.body.currentLocation, req.body.destination,
                             req.body.timeDeparture, req.body.periodDeparture,
                             req.body.datepicker, req.body.smokerRadio,
                             req.body.animalRadio,req.body.bagaggeRadio,
                             req.body.commentsRide
                            )


    });
};

function insert_into_searchTravel (currentLocation, destination,time,period,date,smoker,animals,bagagge,comments)
{

    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'plokij123',
        database: 'covosocialschema'
    });

    connection.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
    });
    connection.query('INSERT INTO searchtravel(startAddress,destinationAddress,comments,pets,departureTime,departureDate)' +
        'VALUES (\'' + currentLocation +'\',\''+ destination+'\',\''+comments+'\',\''+animals
        +'\',\''+time+period+'\',\''+ date+ '\')' , function (err, rows, fields) {
        if (!err)
            console.log('Added!');
        else
            console.log('Error while performing Query.');
    });

    connection.end();
}