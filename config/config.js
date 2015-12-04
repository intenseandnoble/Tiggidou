/**
 * Created by Dave Bernier on 16/11/15.
 * Here is the basic configuration of the application *
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

//Change exports when changing mode, may be usefull for the login and other fonctionnalities
exports.Config = production;
//exports.Config = development;