/**
 * Created by dave on 10/11/15.
 */
//Constante
var NUMBER_TYPE_COMMENT = 0;
//utils et model
var utils = require('../controllers/utils.js');
var Comments = require('./comments').Comments;
var Score = require('./score').Score;
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
var scoreArray;

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

    scoreArray = [];

}



Profile.prototype.setUserValue = function(user) {
    //nom d'utilisateur
    userName = user.get("firstName") + " " + user.get("familyName");
    userAvatar = user.get("avatar");
    userId = user.get('idUser');
    userOfProfile = user.get('username');
    age = user.get('age');
    education = user.get('education');
    music = user.get('music');
    anecdote = user.get('anecdote');
    goalInLife = user.get('goalInLife');

    scoreArray = getScores();

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

function getScores () {
    var promiseScoreArray = [];

    return new Score().where({
        userId:userId
    }).fetch()
        .then(function (result) {

            //calcul du score
            /* driver scores */
            var driverAvgScore = roundingCeilOrFloor(result.get('driverTotalScore') / (result.get('driverNbVotes') * 5));
            var driverPScore = roundingCeilOrFloor(result.get('dPunctualityScore') / result.get('driverNbVotes'));
            var driverCScore = roundingCeilOrFloor(result.get('dCourtesyScore') / result.get('driverNbVotes'));
            var driverRScore = roundingCeilOrFloor(result.get('dReliabilityScore') / result.get('driverNbVotes'));
            var driverSScore = roundingCeilOrFloor(result.get('dSecurityScore') / result.get('driverNbVotes'));
            var driverOScore = roundingCeilOrFloor(result.get('dComfortScore') / result.get('driverNbVotes'));

            /* passenger scores */
            var passengerAvgScore = roundingCeilOrFloor(result.get('passengerTotalScore') / (result.get('passengerNbVotes') * 3));
            var passengerPScore = roundingCeilOrFloor(result.get('pPunctualityScore') / result.get('passengerNbVotes'));
            var passengerCScore = roundingCeilOrFloor(result.get('pCourtesyScore') / result.get('passengerNbVotes'));
            var passengerLScore = roundingCeilOrFloor(result.get('pPolitenessScore') / result.get('passengerNbVotes'));

            promiseScoreArray.push(driverAvgScore);
            promiseScoreArray.push(driverPScore);
            promiseScoreArray.push(driverCScore);
            promiseScoreArray.push(driverRScore);
            promiseScoreArray.push(driverSScore);
            promiseScoreArray.push(driverOScore);

            promiseScoreArray.push(passengerAvgScore);
            promiseScoreArray.push(passengerPScore);
            promiseScoreArray.push(passengerCScore);
            promiseScoreArray.push(passengerLScore);

            return promiseScoreArray;
        })
}

function renderProfile(req, res, ps, page) {
    //and resolution de la promeese sur les scores
    Promise.all(scoreArray)
        .then(function (scores){

            res.render(page, {
                logged: utils.authentificated(req),
                userName: userName,
                avatarImage: userAvatar,

                driverAverageScore: scores[0],
                dPunctualityScore: scores[1],
                dCourtesyScore: scores[2],
                dReliabilityScore: scores[3],
                dSecurityScore: scores[4],
                dComfortScore: scores[5],

                passengerAverageScore: scores[6],
                pPunctualityScore: scores[7],
                pCourtesyScore: scores[8],
                pPolitenessScore: scores[9],

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