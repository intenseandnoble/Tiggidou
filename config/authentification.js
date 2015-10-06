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
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};