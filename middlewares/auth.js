/**
 * Created by mojun on 4/17/16.
 */
var settings = require('../settings.js');
var eventproxy = require('eventproxy');
var UserModel = require('../models/user.js');
var UserProxy = require('../proxy/user.js');

exports.gen_session = function (user, res) {
    var auth_token = user._id + '$$$$';
    var opts = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        signed: true,
        httpOnly: true
    };
    res.cookie(settings.cookieSecret, auth_token, opts);
};

exports.authUser = function (req, res, next) {
    var ep = new eventproxy();
    ep.fail(next);

    res.locals.current_user = null;

    ep.all('get_user', function (user) {
        if (!user) {
            return next();
        }
        user = res.locals.current_user = req.session.user = new UserModel(user);
        next();
    });

    if (req.session.user) {
        ep.emit('get_user', req.session.user);
    } else {
        var auth_token = req.signedCookies[settings.cookieSecret];
        if (!auth_token) {
            return next();
        }

        var auth = auth_token.split('$$$$');
        var user_id = auth[0];
        UserProxy.getUserById(user_id, ep.done('get_user'));
    }
};