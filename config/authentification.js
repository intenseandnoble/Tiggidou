/**
 * Created by Dave Bernier on 28/09/15.
 * hold all our client secret keys (facebook, google, ...)
 */
var config = require("./config").Config;

//https://developers.facebook.com/apps/1485205418448219/dashboard/
var prodFacebookAuth = {
    'clientID'      : '1485205418448219', // your App ID
    'clientSecret'  : '762cbe869c813e1e47e9f4f902702bfa', // your App Secret
    'callbackURL'   : 'http://132.210.238.88:8080/auth/facebook/callback'
};
//https://developers.facebook.com/apps/1494340877534673/dashboard/
var devFacebookAuth = {
    'clientID'      : '1494340877534673', // your App ID
    'clientSecret'  : '6d19339218d1fed159a9a9da680ffc67', // your App Secret
    'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
};
//TODO lorsque le site sera hébergé, ajouter le lien sur google et ici
var prodGoogleAuth = {
    'clientID'      : '56140469261-h17r00bo0kc29sen21mi4kghlu1kmcf9.apps.googleusercontent.com',
    'clientSecret'  : 'b7CTlPWTacsbV_CKNulRDjiK',
    'callbackURL'   : 'http://132.210.238.88:8080/auth/google/callback'
};
//https://console.developers.google.com/apis/credentials/oauthclient/56140469261-h17r00bo0kc29sen21mi4kghlu1kmcf9.apps.googleusercontent.com?project=covoiturage-1103&hl=fr
var devGoogleAuth = {
    'clientID'      : '56140469261-h17r00bo0kc29sen21mi4kghlu1kmcf9.apps.googleusercontent.com',
    'clientSecret'  : 'b7CTlPWTacsbV_CKNulRDjiK',
    'callbackURL'   : 'http://localhost:8080/auth/google/callback'
};

module.exports = {
    'facebookAuth' : config.env == "prod" ? prodFacebookAuth : devFacebookAuth,
    'googleAuth' : config.env == "prod" ? prodGoogleAuth : devGoogleAuth
};


