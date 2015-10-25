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

    // rechercher
    app.get('/search', function (req, res) {

        //faire une recherche et afficher son r�sultat

    });

    // profile
    app.get('/profile', function(req, res){

        //Todo prendre les donnees de l'utilisateur connecte
        //Todo faire en sorte qu'un vote soit pris en compte par le serveur/bd
        var driverAvgScore;
        var driverPScore;
        var driverCScore;
        var driverRScore;
        var driverSScore;
        var driverOScore;

        var passengerAvgScore;
        var passengerPScore;
        var passengerCScore;
        var passengerLScore;

        var userName;
        var pageName;

        new Model.Users({'email': 'alcol@colo.com' }).fetch().then(function(user) {
            if(user){
                //nom de la page
                pageName = "Profil";

                //nom d'utilisateur
                userName = user.get("firstName") + " " + user.get("familyName");
                //anecdotes personnelles

                //photo de profil

                //commentaires




                //calcul du score
                /* driver scores */
                driverAvgScore = user.get('driverTotalScore') / (user.get('driverNbVotes') * 5);
                if (driverAvgScore % 1 != 0 && driverAvgScore % 1 >= 0.5) {
                    driverAvgScore = Math.ceil(driverAvgScore);
                } else if (driverAvgScore % 1 < 0.5) {
                    driverAvgScore = Math.floor(driverAvgScore);
                }


                driverPScore = user.get('dPunctualityScore') / user.get('driverNbVotes');
                if (driverPScore % 1 != 0 && driverPScore % 1 >= 0.5) {
                    driverPScore = Math.ceil(driverPScore);
                } else if (driverPScore % 1 < 0.5) {
                    driverPScore = Math.floor(driverPScore);
                }
                driverCScore = user.get('dCourtesyScore') / user.get('driverNbVotes');
                if (driverCScore % 1 != 0 && driverCScore % 1 >= 0.5) {
                    driverCScore = Math.ceil(driverCScore);
                } else if (driverCScore % 1 < 0.5) {
                    driverCScore = Math.floor(driverCScore);
                }
                driverRScore = user.get('dReliabilityScore') / user.get('driverNbVotes');
                if (driverRScore % 1 != 0 && driverRScore % 1 >= 0.5) {
                    driverRScore = Math.ceil(driverRScore);
                } else if (driverRScore % 1 < 0.5) {
                    driverRScore = Math.floor(driverRScore);
                }
                driverSScore = user.get('dSecurityScore') / user.get('driverNbVotes');
                if (driverSScore % 1 != 0 && driverSScore % 1 >= 0.5) {
                    driverSScore = Math.ceil(driverSScore);
                } else if (driverSScore % 1 < 0.5) {
                    driverSScore = Math.floor(driverSScore);
                }
                driverOScore = user.get('dComfortScore') / user.get('driverNbVotes');
                if (driverOScore % 1 != 0 && driverOScore % 1 >= 0.5) {
                    driverOScore = Math.ceil(driverOScore);
                } else if (driverOScore % 1 < 0.5) {
                    driverOScore = Math.floor(driverOScore);
                }


                /* passenger scores */
                passengerAvgScore = user.get('passengerTotalScore') / (user.get('passengerNbVotes') * 3);
                if (passengerAvgScore % 1 != 0 && passengerAvgScore % 1 >= 0.5) {
                    passengerAvgScore = Math.ceil(passengerAvgScore);
                } else if (passengerAvgScore % 1 < 0.5) {
                    passengerAvgScore = Math.floor(passengerAvgScore);
                }

                passengerPScore = user.get('pPunctualityScore') / user.get('passengerNbVotes');
                if (passengerPScore % 1 != 0 && passengerPScore % 1 >= 0.5) {
                    passengerPScore = Math.ceil(passengerPScore);
                } else if (passengerPScore % 1 < 0.5) {
                    passengerPScore = Math.floor(passengerPScore);
                }
                passengerCScore = user.get('pCourtesyScore') / user.get('passengerNbVotes');
                if (passengerCScore % 1 != 0 && passengerCScore % 1 >= 0.5) {
                    passengerCScore = Math.ceil(passengerCScore);
                } else if (passengerCScore % 1 < 0.5) {
                    passengerCScore = Math.floor(passengerCScore);
                }
                passengerLScore = roundingCeilOrFloor(user.get('pPolitenessScore') / user.get('passengerNbVotes'));
                /*if (passengerLScore % 1 != 0 && passengerLScore % 1 >= 0.5) {
                    passengerLScore = Math.ceil(passengerLScore);
                } else if (passengerLScore % 1 < 0.5) {
                    passengerLScore = Math.floor(passengerLScore);
                }*/
            }


        }).then(function (obj)   {
            res.render('pages/profile.ejs',{
                pageName : pageName,
                userName : userName,

                driverAverageScore : driverAvgScore,
                dPunctualityScore: driverPScore,
                dCourtesyScore: driverCScore,
                dReliabilityScore: driverRScore,
                dSecurityScore: driverSScore,
                dComfortScore: driverOScore,

                passengerAverageScore : passengerAvgScore,
                pPunctualityScore: passengerPScore,
                pCourtesyScore: passengerCScore,
                pPolitenessScore: passengerLScore,

                foot : foot,
                header:header
            })});

    });

    app.post('/rate_driver', function (req, res) {


        var ratePunctuality = req.body.dPunctualityVote;
        var rateCourtesy = req.body.dCourtesyVote;
        var rateReliability = req.body.dReliabilityVote;
        var rateSecurity = req.body.dSecurityVote;
        var rateComfort = req.body.dPunctualityVote;
        var vote = new Model.ratings({'votingUser': '1', 'judgedUser':'2', 'ratingType':'0'});

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
        }});
        res.redirect('/profile');

    });

    app.post('/rate_passenger', function (req, res) {


        var ratePunctuality = req.body.pPunctualityVote;
        var rateCourtesy = req.body.pCourtesyVote;
        var ratePoliteness = req.body.pPolitenessVote;

        var vote = new Model.ratings({'votingUser': '1', 'judgedUser':'2', 'ratingType':'1'});

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
            }});
        res.redirect('/profile');

    });

    app.post('/post-ride', function (req, res) {

        var time = req.body.timeDeparture;

        if(req.body.periodDeparture == 'PM') req.body.timeDeparture+=12;

        new Model.TravelRequest().save({ //todo: I had to remove foreign key constraints to make this work...speak with the others about this
                startAddress :req.body.currentLocation,
                destinationAddress:req.body.destination,
                travelTimes:time,
                 // req.body.datepicker, req.body.smokerRadio,//todo: Add Date in Database on searchTravel
                pets: 0, //todo change the html so it fits an int
                luggageSize :0, //todo change html so luggagesize is int instead of radio button
                comments: req.body.commentsRide},
            {method: 'insert'}
        ).catch(function (err) {
                console.log(err);
                res.redirect('/');

            });
        res.redirect('/');
    });


    //Searching rides

    app.get('/search-ride', function (req, res) {

        var driver_arr = [];
        var comment_arr = [];
        var seatsTaken_arr = [];
        var seatsAvailable_arr = [];
        var travelTime_arr = [];
        var departureTime_arr = [];
        var luggageSize_arr = [];
        var petsAllowed_arr = [];
        var cost_arr = [];
        var dest = req.query.destination;
        var currLocation = req.query.currentLocation;


        var finishRequest = function () {
            res.render('pages/results.ejs', {
                drivers: driver_arr,
                comment: comment_arr,
                seatsTaken: seatsTaken_arr,
                seatsAvailable: seatsAvailable_arr,
                travelTime: travelTime_arr,
                departureTime: departureTime_arr,
                luggageSize: luggageSize_arr,
                petsAllowed: petsAllowed_arr,
                cost: cost_arr,
                destination: dest,
                currentLocation: currLocation,
                header: header,
                foot: foot
            });
        };

        new Model.travel().where({
            destinationAddress: dest,
            startAddress: currLocation
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
                    comment_arr.push(resultJSON[i]['comments']);
                    seatsTaken_arr.push(resultJSON[i]['takenSeat']);
                    seatsAvailable_arr.push(resultJSON[i]['availableSeat']);
                    travelTime_arr.push(resultJSON[i]['travelTimes']);
                    departureTime_arr.push(resultJSON[i]['departureTime']);
                    luggageSize_arr.push(resultJSON[i]['luggagesSize']);
                    petsAllowed_arr.push(resultJSON[i]['petsAllowed']);
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

function roundingCeilOrFloor (score) {

    if (score % 1 != 0 && score % 1 >= 0.5) {
        score = Math.ceil(score);
    } else if (score % 1 < 0.5) {
        score = Math.floor(score);
    }

    return score;
}


