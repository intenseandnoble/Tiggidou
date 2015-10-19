/**
 * Created by dave on 28/09/15.
 * hold all our client secret keys (facebook, twitter?, google, ...)
 */

module.exports = {

    'facebookAuth' : {
        'clientID'      : '1485205418448219', // your App ID
        'clientSecret'  : '762cbe869c813e1e47e9f4f902702bfa', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'googleAuth' : {
        'clientID'      : '56140469261-h17r00bo0kc29sen21mi4kghlu1kmcf9.apps.googleusercontent.com',
        'clientSecret'  : 'b7CTlPWTacsbV_CKNulRDjiK',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};