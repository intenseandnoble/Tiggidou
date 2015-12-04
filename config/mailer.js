/**
 * Created by Dave Bernier on 25/10/15.
 * http://nodemailer.com/
 * This class need a valide email
 * Google and hotmail limits number of email sent
 */

var nodemailer = require('nodemailer');
var log = require('./logger').log;
/*
module.exports = {
    sendMail : function(req, res){
        // send mail with defined transport object
        var mailOptions = {
            from: 'sender@mail', // sender address
            to: 'dave.bernier.12.14@gmail.com', // list of receivers
            subject: 'Oublie de mot de passe', // Subject line
            text: "Hello world ✔" // plaintext body
        };
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
                callback = error;
            }else {
                console.log('Message sent: ' + info.response);
            }


        });
    }
};
*/
