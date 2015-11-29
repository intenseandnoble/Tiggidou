/**
 * Created by dave on 27/10/15.
 */
var bunyan = require('bunyan');
var moment = require('moment');

//Log configuration
var logging = bunyan.createLogger({
    name: "tiggidou",
    time: moment().format("YYYY-MM-DDTHH:mm:ss.sssZ"),
    streams: [
        {
            level: 'debug',
            stream: process.stdout
        },
        {
            level: 'info',
            path: '../logFile.log'
        },
        {
            level: 'error',
            path: '../errorLogFile.log'
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

