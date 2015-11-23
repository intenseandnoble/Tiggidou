/**
 * Created by dave on 16/11/15.
 */

var development = {
    appAddress : 'localhost:8080',
    socketPort : 8080,
    socketHost : '127.0.0.1',
    env : global.process.env.NODE_ENV = 'dev'
};

var production = {
    appAddress : '132.210.238.88:8080',
    socketPort : 8080,
    socketHost : '132.210.238.88',
    env : global.process.env.NODE_ENV = 'prod'
};

//exports.Config = production;
exports.Config = development;