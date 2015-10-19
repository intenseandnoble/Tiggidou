/**
 * Created by Mythian on 9/30/2015.
 */
var covoso = require(__dirname + '/../models/covosocialSearchDepartures');
var express = require('express');
var database = require(__dirname + '/../config/database');
var ratingsModel = require('../models/user').ratings;

module.exports = function (app) {
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

    // update authors set "bio" = 'Short user bio' where "id" = 1
    app.post('/rate_driver', function (req, res) {

        console.log(req.body);
        var rate = req.body.dstarVote;
        console.log(req.body.dstarVote);
        var vote = new ratingsModel();
        console.log(vote.idAttribute);
        vote.save({'votingUser': '1', 'judgedUser':'2', rating:rate}, {method: 'insert'});
        console.log(vote);
        res.redirect('/profile');

    });

};

function insert_into_searchTravel (currentLocation, destination,time,period,date,smoker,animals,bagagge,comments)
{
    var request = 'INSERT INTO searchtravel(startAddress,destinationAddress,comments,pets,departureTime,departureDate)' +
        'VALUES (\'' + currentLocation +'\',\''+ destination+'\',\''+comments+'\',\''+animals
        +'\',\''+time+period+'\',\''+ date+ '\')';

    database.insertRequest(request, function (err, rows, fields) {
        if (!err)
            console.log('Added!');
        else
            console.log('Error while performing Query.');
    });

    connection.end();
}