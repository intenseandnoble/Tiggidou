/**
 * Created by vasi2401 on 2015-09-18.
 */

//load the model
var covoso = require(__dirname + '/../models/covosocialSearchDepartures');
var express = require('express');
var Model = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var header = require('../views/fr/header.js');
var foot = require('../views/fr/footer.js');

// show routes to app
module.exports = function (app, passport) {


// routes ======================================================================

    // api ---------------------------------------------------------------------
    //single page application
    app.get('/', function (req, res) {
        res.render('pages/index.ejs',
            {
                header: header,
                foot : foot
            });
    });

    // profile
    app.get('/profile', function(req, res){

        //Todo prendre les donnees de l'utilisateur connecte
        //Todo faire en sorte qu'un vote soit pris en compte par le serveur/bd
        var driverAvgScore;
        var passengerAvgScore;
        var userName;
        var pageName;

        new Model.Users({'email': 'OALd@allo.com' }).fetch().then(function(user) {
            if(user){
                //nom de la page
                pageName = "Profil";

                //nom d'utilisateur
                userName = user.firstName + " " + user.familyName;
                //anecdotes personnelles

                //photo de profil

                //commentaires


                //calcul du score
                driverAvgScore = user.get('driverTotalScore')/user.get('driverNbVotes');
                if (driverAvgScore%1 != 0 && driverAvgScore%1 >= 0.5) {
                    driverAvgScore = Math.ceil(driverAvgScore);

                } else if (driverAvgScore%1 < 0.5) {
                    driverAvgScore = Math.floor(driverAvgScore);
                }

                passengerAvgScore = user.get('passengerTotalScore')/user.get('passengerNbVotes');
                if (passengerAvgScore%1 != 0 && passengerAvgScore%1 >= 0.5) {
                    passengerAvgScore = Math.ceil(passengerAvgScore);
                } else if (passengerAvgScore%1 < 0.5) {
                    passengerAvgScore = Math.floor(passengerAvgScore);
                }
            }


        }).then(function (obj)   {
            res.render('pages/profile.ejs',{
                pageName : pageName,
                userName : userName,
                driverAverageScore : driverAvgScore,
                passengerAverageScore : passengerAvgScore,
                foot : foot,
                header:header
            })});

    });


    app.post('/rate_driver', function (req, res) {

        console.log(req.body);
        var rate = req.body.dstarVote;
        console.log(req.body.dstarVote);
        var vote = new Model.ratings();
        console.log(vote.idAttribute);
        vote.save({'votingUser': '1', 'judgedUser':'2', rating:rate}, {method: 'insert'});
        console.log(vote);
        res.redirect('/profile');

    });


    app.post('/post-ride', function (req, res) {

        var pets = 0;
        var luggage =0;

        date=req.body.datepicker;
        var newdate = date.split("/").reverse().join("/");


        if(req.body.hiddenUser == 'driver') //insert into Travel
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
                    console.log(err);


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
                    console.log(err);


                });
        }

        res.redirect('/');
    });


    //Searching rides

    app.get('/search', function (req, res) {


        var driver_arr = [];
        var passenger_arr=[];
        var comment_arr = [];
        var seatsTaken_arr = [];
        var seatsAvailable_arr = [];
        var travelTime_arr = [];
        var departureTime_arr = [];
        var departureDate_arr = [];
        var luggageSize_arr = [];
        var petsAllowed_arr = [];
        var cost_arr = [];

        var dest = req.query.destination;
        var currLocation = req.query.currentLocation;

        var finishRequest = function () {
            res.render('pages/results.ejs', {

                drivers: driver_arr,
                passengers: passenger_arr,
                comment: comment_arr,
                seatsTaken: seatsTaken_arr,
                seatsAvailable: seatsAvailable_arr,
                travelTime: travelTime_arr,
                departureTime: departureTime_arr,
                departureDate: departureDate_arr,
                luggageSize: luggageSize_arr,
                petsAllowed: petsAllowed_arr,
                cost: cost_arr,
                destination: dest,
                currentLocation: currLocation,
                header: header,
                foot: foot
            });
        };

        if(req.query.searchDriver == "on") {

            new Model.Travel().where({
                destinationAddress: dest,
                startAddress: currLocation
            }).query(function (qb) {
                qb.orderBy('departureDate', 'ASC');
            }).fetchAll().then(function (user) {

                var resultJSON = user.toJSON();

                if (resultJSON.length == 0) {
                    res.render('pages/no-results.ejs', {
                        header: header,
                        foot: foot
                    });
                }
                else {

                    for (i = 0; i < resultJSON.length; i++) {

                        driver_arr.push(resultJSON[i]['driver']);
                        luggageSize_arr.push(resultJSON[i]['luggagesSize']);
                        departureTime_arr.push(resultJSON[i]['departureTime']);
                        comment_arr.push(resultJSON[i]['comments']);
                        petsAllowed_arr.push(resultJSON[i]['petsAllowed']);
                        departureDate_arr.push(resultJSON[i]['departureDate']);
                        seatsAvailable_arr.push(resultJSON[i]['availableSeat']);
                        seatsTaken_arr.push(resultJSON[i]['takenSeat']);
                        cost_arr.push(resultJSON[i]['cost']);
                    }

                    finishRequest();
                }

            }).catch(function (err) {

                res.render('pages/no-results.ejs', {
                    header: header,
                    foot: foot //In case of error

                });

            });

        }

        else {

            new Model.TravelRequest().where({
                destinationAddress: dest,
                startAddress: currLocation
            }).query(function (qb) {
                qb.orderBy('departureDate', 'ASC');
            }).fetchAll().then(function (user) {

                var resultJSON = user.toJSON();

                if (resultJSON.length == 0) {
                    res.render('pages/no-results.ejs', {
                        header: header,
                        foot: foot
                    });
                }
                else {

                    for (i = 0; i < resultJSON.length; i++) {

                        passenger_arr.push(resultJSON[i]['passenger']);
                        luggageSize_arr.push(resultJSON[i]['luggageSize']);
                        departureTime_arr.push(resultJSON[i]['departureTime']);
                        comment_arr.push(resultJSON[i]['comments']);
                        petsAllowed_arr.push(resultJSON[i]['pets']);
                        departureDate_arr.push(resultJSON[i]['departureDate']);
                    }

                    finishRequest();
                }


            }).catch(function (err) {

                res.render('pages/no-results.ejs', {
                    header: header,
                    foot: foot //In case of error

                });

            });
        }

    });


    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // login
    app.get('/login', function(req, res) {
        if(req.user){
            res.redirect('/');
        }
        else{
            //res.render('pages/login.ejs'/*, {message: req.flash('loginMessage')}*/);
            res.render('pages/login.ejs',
                {
                    header: header,
                    foot : foot
                });
        }
    });
    app.post('/login', loginPost);

    // signup
    app.get('/sign-up', function (req, res) {
        //res.render('pages/sign-up.ejs'/*, {message: req.flash('signupMessage')}*/);
        res.render('pages/sign-up.ejs',
            {
                header: header,
                foot : foot
            });
    });

    //processs the signup form
    app.post('/sign-up', function(req, res, next) {
        var user = req.body;
        var usernamePromise = null;
        usernamePromise = new Model.Users({email: user.email}).fetch();
        return usernamePromise.then(function(model) {
            if(model) {
                res.render('pages/sign-up.ejs', {
                    title: 'signup',
                    errorMessage: 'username already exists',
                    header: header,
                    foot : foot});
            } else {
                // TODO MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
                var password = user.password;
                var hash = bcrypt.hashSync(password);
                var typeSign = "local";
                var firstName = user.firstName;
                var familyName = user.familyName;
                var signUpUser = new Model.Users({
                    email: user.email,
                    password: hash,
                    typeSignUp: typeSign,
                    firstName: firstName,
                    familyName: familyName
                });

                signUpUser.save().then(function(model) {
                    // sign in the newly registered user
                    loginPost(req, res, next);
                });
            }
        })});

    app.get('/results', function (req, res) {
        //res.render('pages/results.ejs')
        res.render('pages/results.ejs',
            {
                header: header,
                foot : foot
            });
    });

    app.get('/no-results', function (req, res) {
        //res.render('pages/no-results.ejs')
        res.render('pages/no-results.ejs',
            {
                header: header,
                foot : foot
            });
    });

    app.get('/ask-ride',requireAuth, function (req, res) {
        //res.render('pages/ask-ride.ejs')
        res.render('pages/ask-ride.ejs',
            {
                header: header,
                foot : foot
            });
    });


    app.get('/logout',requireAuth, function(req, res){
        req.logout();
        res.redirect('/');
    });

    //TODO faire les liens de ceci
    //... ajouter plus de fonctionalit�s
    function loginPost(req, res, next) {
        passport.authenticate('local-login', {
                successRedirect : '/profile',
                failureRedirect : '/login',
                failureFlash : true //allow flash message
            },
            function(err, user, info) {
                if(err) {
                    return res.render('pages/login.ejs',
                        {
                            title: 'Login',
                            errorMessage: err.message,
                            header: header,
                            foot : foot
                        });
                }

                if(!user) {
                    return res.render('pages/login.ejs',
                        {
                            title: 'Login',
                            errorMessage: info.message,
                            header: header,
                            foot : foot
                        });
                }
                return req.logIn(user, function(err) {
                    if(err) {
                        return res.render('pages/login.ejs',
                            {
                                title: 'Login',
                                errorMessage: err.message,
                                header: header,
                                foot : foot
                            });
                    } else {
                        return res.redirect('/profile');
                    }
                });
            })(req, res, next);
    }
    function loginSignFacebook(req, res, next) {
        passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/sign-up'
            },
            function(err, user, info) {
                if(err) {
                    return res.render('pages/login.ejs',
                        {
                            title: 'Login',
                            errorMessage: err.message,
                            header: header,
                            foot : foot
                        });
                }

                if(!user) {
                    return res.render('pages/login.ejs',
                        {
                            title: 'Login',
                            errorMessage: info.message,
                            header: header,
                            foot : foot
                        });
                }
                return req.logIn(user, function(err) {
                    if(err) {
                        return res.render('pages/login.ejs',
                            {
                                title: 'Login',
                                errorMessage: err.message,
                                header: header,
                                foot : foot
                            });
                    } else {
                        return res.redirect('/profile');
                    }
                });
            })(req, res, next);
    }
};

// route middleware to make sure a user is logged in
function requireAuth(req, res, next) {
    //Check if the user is logged in
    if (req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
}

function getUserName(id){

   var firstName = "Unknown";

    var finishRequest = function () {return firstName;};

    new Model.Users({idUser: id}).fetch().then(function (model) {
        firstName = model.get('firstName');
        console.log(id + " : " + firstName);
        finishRequest();
    });


}









