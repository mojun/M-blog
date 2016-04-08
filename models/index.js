/**
 * Created by test on 16/4/8.
 */
const settings  = require('../settings'),
    mongoose    = require('mongoose'),
    dbUrl       = settings.dbUrl();

connect()
    .on('connecting', function() {
        debugInfo('database connecting -->  ' + dbUrl);
    })
    .on('connected', function () {
        debugInfo('database connected -->  ' + dbUrl);
    })
    .on('error', function(err) {
        debugInfo(err);
        process.exit(1);
    });

function connect() {
    var options = { server: {poolSize: 20, socketOptions: {keepAlive: 1} } };
    return mongoose.connect(dbUrl, options).connection;
}

exports.User = require('./user');