/**
 * Created by dave on 27/10/15.
 */
var bunyan = require('bunyan');

//Log configuration
var logging = bunyan.createLogger({
    name: "covoiturage",
    streams: [
        {
            level: 'debug',
            stream: process.stdout
        },
        {
            level: 'info',
            path: '../myLogFile.log'
        },
        {
            level: 'error',
            path: '../myErrLogFile.log'
        }
    ],
    serializers: {
        req: bunyan.stdSerializers.req,
        res: bunyan.stdSerializers.res,
        err: bunyan.stdSerializers.err
    }
});

module.exports = {
    log: logging
};





//TODO ecrire les log par jour genre: 20151026.log

