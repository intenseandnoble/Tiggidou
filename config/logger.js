/**
 * Created by Dave Bernier on 27/10/15.
 */
var bunyan = require('bunyan');
var moment = require('moment');

//Log configuration
var logging = bunyan.createLogger({
    name: "tiggidou",
    //set today date at local times, if you want only UTC, juste erase time field
    time: moment().format("YYYY-MM-DDTHH:mm:ss.sssZ"),
    //where the type of data will be write (highter level will be write in lower level
    //ex: err wil be write in debug
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

