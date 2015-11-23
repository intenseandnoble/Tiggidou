/**
 * Created by dave on 28/09/15.
 * hold all our client secret keys (facebook, twitter?, google, ...)
 */
var config = require("./config").Config;

var prodFacebookAuth = {
    'clientID'      : '1485205418448219', // your App ID
    'clientSecret'  : '762cbe869c813e1e47e9f4f902702bfa', // your App Secret
    'callbackURL'   : 'http://132.210.238.88:8080/auth/facebook/callback'
};
var devFacebookAuth = {
    'clientID'      : '1494340877534673', // your App ID
    'clientSecret'  : '6d19339218d1fed159a9a9da680ffc67', // your App Secret
    'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
};

var prodGoogleAuth = {
    'clientID'      : '56140469261-h17r00bo0kc29sen21mi4kghlu1kmcf9.apps.googleusercontent.com',
    'clientSecret'  : 'b7CTlPWTacsbV_CKNulRDjiK',
    'callbackURL'   : 'http://132.210.238.88:8080/auth/google/callback'
};

var devGoogleAuth = {
    'clientID'      : '56140469261-h17r00bo0kc29sen21mi4kghlu1kmcf9.apps.googleusercontent.com',
    'clientSecret'  : 'b7CTlPWTacsbV_CKNulRDjiK',
    'callbackURL'   : 'http://localhost:8080/auth/google/callback'
};

module.exports = {
    'facebookAuth' : config.env == "prod" ? prodFacebookAuth : devFacebookAuth,
    'googleAuth' : config.env == "prod" ? prodGoogleAuth : devGoogleAuth
};


