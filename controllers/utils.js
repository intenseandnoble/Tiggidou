/**
 * Created by dave on 09/11/15.
 */
var Model = require('../models/models');
var bcrypt = require('bcrypt-nodejs');
var https = require('https');
var Promise = require('bluebird');
var mailling = require('../config/mailer.js');
var log = require('../config/logger').log;
var moment = require("moment");
var multer = require('multer');
var pathAvatar = './public/images/avatar';

module.exports = {
    requireAuth: requireAuth,
    authentificated: authentificated,
    verifyRecaptcha: verifyRecaptcha,
    roundingCeilOrFloor: roundingCeilOrFloor,
    arrayOrNot: arrayOrNot,
    upload: upload
};

// route middleware to make sure a user is logged in
function requireAuth(req, res, next) {
    //Check if the user is logged in
    if (req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
}

function authentificated(req){
    if(req.isAuthenticated()){
        return true;
    }
    return false;
}

/*https://www.google.com/recaptcha/admin#list*/
var SECRET =  "6LdJfA8TAAAAAGndnIbSyPNBm-X2BphdUHBb-fRT"; //TODO met le secret ici...
//helper function to make API call to recatpcha and check response
function verifyRecaptcha(key, callback){
    https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + SECRET + "&response=" + key, function(res){
        var data = "";
        res.on('data', function(chunk){
            data += chunk.toString();
        });
        res.on('end', function(){
            try{
                var parsedData = JSON.parse(data);
                callback(parsedData.success);
            } catch(e){
                callback(false);
            }
        });
    });
}

function roundingCeilOrFloor (score) {
    if (score % 1 != 0 && score % 1 >= 0.5) {
        score = Math.ceil(score);
    } else if (score % 1 < 0.5) {
        score = Math.floor(score);
    }
    return score;
}

function arrayOrNot (avar) {
    if(avar.constructor == Array) {
        return avar[1];
    } else {
        return avar;
    }
}

//uploading
// https://github.com/expressjs/multer
var upload = multer({
    dest: pathAvatar,
    /*limits: {
     fieldNameSize: 100,
     files: 2,
     fields: 5
     },*/
    rename: function(fieldname, filename){
        return Math.random() + Date.now();
    },
    onFileUploadStart: function (file){
        log.info(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: function (file){
        log.info(file.fieldname + ' uploaded to ' + file.path);
    }
});

//TODO a supprimer quand les modèles seront refait
function getUserName(id){

    var firstName = "Unknown";

    var finishRequest = function () {return firstName;};

    new Model.Users({idUser: id}).fetch().then(function (model) {
        firstName = model.get('firstName');
        console.log(id + " : " + firstName);
        finishRequest();
    });
}

var commentariesTexts = [];

function getUsernameFromDBAsync(userId) {

    return new Model.Users({
        idUser: userId
    })
        .fetch()
        .then(function(u){
            var prenom = u.get('firstName');
            var nom = u.get('familyName');
            var s = prenom + " " + nom;
            return s;
        });
}

function updateSeats(travelId, takenSeats, availableSeats){

    new Model.Travel().where({
        idAddTravel: travelId
    }).save({

        takenSeat :takenSeats+1,
        availableSeat : availableSeats-1

    }, {method: 'update'}).catch(function (err) {
        log.error(err);
    });

}

function addTravelPassenger(travelId, userId){

    new Model.TravelPassengers().save({
            passenger:userId,
            travel : travelId

        },
        {method: 'insert'}
    ).catch(function (err) {
            log.error(err);
        });

}