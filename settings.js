
var internals = {
    cookieSecret: '34jkfshfj=.,;',
    sessionDb: 'sessionDb',
    siteName: 'MJBlog',
    db: 'blog',
    host: 'localhost',
    port: 27017,
    username: '',
    password: '',
    defaultExpirationTime:  1000 * 60 * 60 * 24 * 14,
    mail_opts: {
        host: 'smtp.163.com',
        port: 25,
        auth: {
            user: 'appleshitman@163.com',
            pass: 'shit120'
        }
    }
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
    return url;
}

module.exports = internals;