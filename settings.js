
var urlencode = require("urlencode");

var internals = {
    cookieSecret: '34jkfshfj=.,;',
    sessionDb: 'sessionDb',
    db: 'blog',
    host: 'localhost',
    port: 27017,
    username: '',
    password: '',
    defaultExpirationTime:  1000 * 60 * 60 * 24 * 14
};

internals.dbUrl = function () {
    return composePath(internals.db);
};

internals.sessionDbUrl = function () {
    return composePath(internals.sessionDb);
};

function composePath(dbName) {
    var auth = internals.username.length > 0 && internals.password.length > 0;
    var url = 'mongodb://';
    if (auth) {
        url += internals.username;
        url += ':';
        url += internals.password;
        url += '@';
    }
    url += internals.host;
    url += ':';
    url += String(internals.port);
    url += '/';
    url += dbName;
    return urlencode(url);
}

module.exports = internals;