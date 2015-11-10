/**
 * Created by dave on 10/11/15.
 */
//Constante
var NUMBER_TYPE_COMMENT = 0;
//utils et model
var utils = require('../controllers/utils.js');
var Comments = require('./comments').Comments;
var modelUsers = require('./user');
var Promise = require('bluebird');
//Vue en francais
var ratingPnD = require('../views/fr/ratingPnD.js');
var header = require('../views/fr/header.js');
var foot = require('../views/fr/footer.js');
var profile = require('../views/fr/profile.js');

module.exports = Profile;

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
var userAvatar;
var userId;
var userOfProfile;
var age;
var education;
var music;
var anecdote;
var goalInLife;

var commentariesTexts;

function Profile() {
    driverAvgScore = null;
    driverPScore = null;
    driverCScore = null;
    driverRScore = null;
    driverSScore = null;
    driverOScore = null;

    passengerAvgScore = null;
    passengerPScore = null;
    passengerCScore = null;
    passengerLScore = null;

    userName = null;
    userAvatar = null;
    userId = null;
    userOfProfile = null;
    age = null;
    education = null;
    music = null;
    anecdote = null;
    goalInLife = null;

    commentariesTexts = [];
}



Profile.prototype.setUserValue = function(user) {
    //nom d'utilisateur
    userName = user.get("firstName") + " " + user.get("familyName");
    userAvatar = user.get("avatar");

    //calcul du score
    /* driver scores */
    driverAvgScore = roundingCeilOrFloor(user.get('driverTotalScore') / (user.get('driverNbVotes') * 5));
    driverPScore = roundingCeilOrFloor(user.get('dPunctualityScore') / user.get('driverNbVotes'));
    driverCScore = roundingCeilOrFloor(user.get('dCourtesyScore') / user.get('driverNbVotes'));
    driverRScore = roundingCeilOrFloor(user.get('dReliabilityScore') / user.get('driverNbVotes'));
    driverSScore = roundingCeilOrFloor(user.get('dSecurityScore') / user.get('driverNbVotes'));
    driverOScore = roundingCeilOrFloor(user.get('dComfortScore') / user.get('driverNbVotes'));

    /* passenger scores */
    passengerAvgScore = roundingCeilOrFloor(user.get('passengerTotalScore') / (user.get('passengerNbVotes') * 3));
    passengerPScore = roundingCeilOrFloor(user.get('pPunctualityScore') / user.get('passengerNbVotes'));
    passengerCScore = roundingCeilOrFloor(user.get('pCourtesyScore') / user.get('passengerNbVotes'));
    passengerLScore = roundingCeilOrFloor(user.get('pPolitenessScore') / user.get('passengerNbVotes'));

    //commentaires
    userId = user.get('idUser');
    userOfProfile = user.get('username');
    age = user.get('age');
    education = user.get('education');
    music = user.get('music');
    anecdote = user.get('anecdote');
    goalInLife = user.get('goalInLife');
};


Profile.prototype.displayProfile = function (req, res, page) {
    var promiseArr = [];

    new Comments().where({
        commentType: 0,
        commentProfileId: userId
    }).fetchAll({withRelated: ['user']})
        //TODO limit the number of results
        .then(function (comm) {
            var resultJSON = comm.toJSON();

            if (resultJSON.length == NUMBER_TYPE_COMMENT) {
                //TODO if no comments
            }
            else {
                for (i = 0; i < resultJSON.length; ++i) {
                    commentariesTexts.push(resultJSON[i]['comment']);
                    promiseArr.push(modelUsers.getUsernameFromDBAsync(resultJSON[i]['commentIssuer']));
                }
            }

            Promise.all(promiseArr).then(function (ps) {
                renderProfile(req, res, ps, page);
            });

        })
};

function renderProfile(req, res, ps, page) {
    res.render(page, {
        logged: utils.authentificated(req),
        userName: userName,
        avatarImage: userAvatar,

        driverAverageScore: driverAvgScore,
        dPunctualityScore: driverPScore,
        dCourtesyScore: driverCScore,
        dReliabilityScore: driverRScore,
        dSecurityScore: driverSScore,
        dComfortScore: driverOScore,

        passengerAverageScore: passengerAvgScore,
        pPunctualityScore: passengerPScore,
        pCourtesyScore: passengerCScore,
        pPolitenessScore: passengerLScore,

        comments: commentariesTexts,
        commentsIssuers: ps,
        userOfProfile: userOfProfile,

        age: age,
        education: education,
        music: music,
        anecdote: anecdote,
        goalInLife: goalInLife,

        profile: profile,
        ratingPnD: ratingPnD,
        foot: foot,
        header: header
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