/**
 * Created by dave on 09/11/15.
 */

//load the model
var Model = require('../models/models');
var bcrypt = require('bcrypt-nodejs');
var https = require('https');
var Promise = require('bluebird');
var mailling = require('../config/mailer.js');
var log = require('../config/logger').log;
var moment = require("moment");
var multer = require('multer');
var pathAvatar = './public/images/avatar';

//View en français
var header = require('../views/fr/header.js');
var foot = require('../views/fr/footer.js');


module.exports = {
    postUploadProfileAvatar: postUploadProfileAvatar,
    postRateDriver: postRateDriver,
    postRatePassenger: postRatePassenger,
    postProfileComment: postProfileComment,
    postRide: postRide,
    postAddPassenger: postAddPassenger,
    postSignUp: postSignUp
};

function postUploadProfileAvatar(req, res){
    upload(req,res,function(err) {
        if(err) {
            //TODO ajouter les messages d'erreurs dans req.flash("profileMessage", err);
            return res.redirect('/profile');
        }

        var userSession = req.session.req.user;

        new Model.Users({'email': userSession.attributes.email }).fetch().then(function(user){
            if(user){
                var filename = req.files.userPhoto.name;
                user.save({
                    avatar:  filename
                }, {method: 'update'});

                res.redirect('/profile');
            }
            else{
                //TODO ajouter les messages d'erreurs dans req.flash("profileMessage", utilisateur non existant);
                return res.redirect('/profile');
            }
        });
    });
}

function postRateDriver(req, res) {
    var ratePunctuality = arrayOrNot(req.body.dPunctualityVote);
    var rateCourtesy = arrayOrNot(req.body.dCourtesyVote);
    var rateReliability = arrayOrNot(req.body.dReliabilityVote);
    var rateSecurity = arrayOrNot(req.body.dSecurityVote);
    var rateComfort = arrayOrNot(req.body.dComfortVote);

    var judgedun = req.body.usernameOfProfile;
    var votingu = req.session.req.user.attributes.idUser;

    new Model.Users({'username':judgedun})
        .fetch()
        .then(function (u) {

            var vote = new Model.Ratings({'votingUser': votingu, 'judgedUser': u.get('idUser'), 'ratingType':'0'});
            vote.fetch().then(function (m) {
                if (m == null) {
                    vote.save(
                        {dratingPunctuality: ratePunctuality,
                            dratingCourtesy:rateCourtesy,
                            dratingReliability:rateReliability,
                            dratingSecurity:rateSecurity,
                            dratingComfort:rateComfort}, {method: 'insert'});
                } else {
                    vote.save(
                        {dratingPunctuality: ratePunctuality,
                            dratingCourtesy:rateCourtesy,
                            dratingReliability:rateReliability,
                            dratingSecurity:rateSecurity,
                            dratingComfort:rateComfort}, {method: 'update'});
                }})
                .then(function(){
                    res.redirect('/profile/'+judgedun);
                });

        });

}

function postRatePassenger(req, res) {



    var ratePunctuality = arrayOrNot(req.body.pPunctualityVote);
    var rateCourtesy = arrayOrNot(req.body.pCourtesyVote);
    var ratePoliteness = arrayOrNot(req.body.pPolitenessVote);

    //jun: judged username, vu:voting user
    var judgedun = req.body.usernameOfProfile;
    var votingu = req.session.req.user.attributes.idUser;

    new Model.Users({'username':judgedun})
        .fetch()
        .then(function (u) {

            var vote = new Model.Ratings({'votingUser': votingu, 'judgedUser': u.get('idUser'), 'ratingType':'1'});

            vote.fetch().then(function (m) {
                if (m == null) {
                    vote.save(
                        {pratingPunctuality: ratePunctuality,
                            pratingCourtesy:rateCourtesy,
                            pratingPoliteness:ratePoliteness}, {method: 'insert'});
                } else {
                    vote.save(
                        {pratingPunctuality: ratePunctuality,
                            pratingCourtesy:rateCourtesy,
                            pratingPoliteness:ratePoliteness}, {method: 'update'});
                }})
                .then(function () {
                    res.redirect('/profile/'+judgedun);
                });
        });
}

function postProfileComment(req, res) {
    var c = req.body.comment;
    var ci = req.session.req.user.attributes.idUser;
    var un = req.body.usernameOfProfile;

    new Model.Users({'username':un})
        .fetch()
        .then( function (u) {
            var commentaire = new Model.Comments({
                'commentIssuer': ci,
                'commentProfileId': u.get('idUser'),
                'commentType': '0',
                'comment': c
            });

            commentaire.save();
            res.redirect('/profile/' + un);

        });

}

function postRide(req, res) {

    var pets = 0;
    var luggage =0;

    date=req.body.datepicker;
    var newdate = date.split("/").reverse().join("/");


    if(req.body.driverCheckbox == 'on') //insert into Travel
    {
        if(req.body.petsRadio_d == 'Yes') pets= 0;
        else pets = 1;

        if(req.body.luggageRadio_d == 'Yes') luggage= 0;
        else luggage = 1;

        new Model.Travel().save({
                startAddress :req.body.currentLocation,
                destinationAddress:req.body.destination,
                departureTime:req.body.clockpicker,
                departureDate: newdate,
                petsAllowed : pets,
                driver:req.session.req.user.id,
                availableSeat:req.body.spinner_d,
                luggagesSize :luggage,
                //comments: req.body.commentsRide_d,
                cost:req.body.cost_d},

            {method: 'insert'}
        ).catch(function (err) {
                log.error(err);
            });
    }


    else //insert into searchTravel
    {
        if(req.body.petsRadio_p == 'Yes') pets= 1;
        else pets = 0;

        if(req.body.luggageRadio_d == 'Yes') luggage= 1;
        else luggage = 0;

        new Model.TravelRequest().save({
                startAddress :req.body.currentLocation,
                destinationAddress:req.body.destination,
                departureTime:req.body.clockpicker,
                departureDate: newdate,
                pets: pets,
                passenger:req.session.req.user.id,
                luggageSize :luggage//,
                //comments: req.body.commentsRide_p
            },

            {method: 'insert'}
        ).catch(function (err) {
                log.error(err);
            });
    }

    res.redirect('/');
}

function postAddPassenger(req, res) {
    //What if 2 users add it at the same time? With only 1 place left? Revisit this
    if(req.user){

        new Model.Travel().where({
            idAddTravel: req.body.idTravel
        }).fetch().then(function (user) {

            if( 0 <user.get('availableSeat')){

                updateSeats(req.body.idTravel, user.get('takenSeat'),  user.get('availableSeat') );
                addTravelPassenger(req.body.idTravel,req.session.req.user.id);
                res.redirect('/');
            }
            else{
                //Not available anymore
            }
        });
    }
    else{
        //res.render('pages/login.ejs'/*, {message: req.flash('loginMessage')}*/);
        res.render('pages/login.ejs',
            {
                logged: authentificated(req),
                header: header,
                foot : foot
            });
    }

    // res.redirect('/');

}

function postSignUp(req, res, next) {
    verifyRecaptcha(req.body["g-recaptcha-response"], function(success){
        if(success){
            var user = req.body;
            var usernamePromise = null;

            var birthday = req.body.birthday_year+req.body.birthday_month+req.body.birthday_day;

            var age =  moment().diff(moment(birthday, "YYYYMMDD"), 'years');

            usernamePromise = new Model.Users({email: user.email}).fetch();
            return usernamePromise.then(function(model) {
                if(model) {
                    req.flash("signupMessage", "Le courriel existe déjà");
                    res.redirect('/sign-up');

                } else {
                    var password = user.password;
                    var passwordConfirm = user.confirm_password;
                    if(!(password == passwordConfirm)){
                        req.flash("signupMessage", "Les mot de passe ne sont pas pareil");
                        res.redirect('/sign-up');
                    }
                    //TODO ajouter la date de naissance
                    //https://stackoverflow.com/questions/2587345/javascript-date-parse (pour les dates)
                    var birthday = moment(req.body.birthday_year+"-"+req.body.birthday_month+"-"+req.body.birthday_day, "YYYY-MM-DD");
                    var age =  moment().diff(birthday, 'years');
                    var dateBirthday = birthday.toDate();
                    if(age < 17){
                        req.flash("signupMessage", "Vous devez être âgé de 17 ans et plus");
                        res.redirect('/sign-up');
                    }

                    var hash = bcrypt.hashSync(password);
                    var typeSign = "local";
                    var firstName = user.firstName;
                    var familyName = user.familyName;



                    var promiseArr = [];

                    promiseArr.push(new Model.Users().getCountName(firstName, familyName));
                    var countUser;

                    Promise.all(promiseArr).then(function(ps){
                        var countTest = ps[0][0];
                        for(var key in countTest){
                            countUser = countTest[key];
                        }

                        var signUpUser = new Model.Users({
                            email: user.email,
                            password: hash,
                            typeSignUp: typeSign,
                            firstName: firstName,
                            familyName: familyName,
                            birthday: dateBirthday,
                            username: firstName + "." + familyName + "." + countUser
                        });

                        signUpUser.save().then(function(model) {
                            // sign in the newly registered user
                            postLogin(req, res, next);
                        });
                    });
                }
            })
        } else {
            var user = req.body;
            req.flash("signupMessage", "captcha échoué");
            res.redirect('/sign-up');
        }
    })
}

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