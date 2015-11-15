/**
 * Created by dave on 09/11/15.
 */
var Model = require('../models/models');
var https = require('https');
var mailling = require('../config/mailer.js');
var log = require('../config/logger').log;

module.exports = {
    requireAuth: requireAuth,
    authentificated: authentificated,
    verifyRecaptcha: verifyRecaptcha,
    arrayOrNot: arrayOrNot
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

function arrayOrNot (avar) {
    if(avar.constructor == Array) {
        return avar[1];
    } else {
        return avar;
    }
}