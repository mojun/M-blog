/**
 * Created by test on 16/4/8.
 */
var validator   = require('validator');
var eventproxy  = require('eventproxy');
var tools       = require('../common/tools');
var mail        = require('../common/mail');
var User        = require('../proxy/user');
var utility     = require('utility');
var settings    = require('../settings');
var authMiddleware = require('../middlewares/auth.js');

exports.showLogin = function (req, res, next) {
    res.render('signin');
};

exports.login = function (req, res, next) {
    var loginname = req.body.name;
    var pass = req.body.pass;
    loginname = validator.trim(loginname);
    pass = validator.trim(pass);
    var ep = new eventproxy();

    ep.fail(next);

    if (!loginname || !pass) {
        res.status(422);
        req.flash('error', '信息不完整.');
        return res.render('signin');
    }

    var getUser;
    if (loginname.indexOf('@') !== -1) {
        getUser = User.getUserByMail;
    } else {
        getUser = User.getUserByLoginName;
    }

    ep.on('login_error', function (login_error) {
        res.status(403);
        req.flash('error', '用户名或密码错误.');
        res.render('signin');
    });
    
    getUser(loginname, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return ep.emit('login_error');
        }
        var passhash = user.pass;
        tools.bcompare(pass, passhash, ep.done(function (bool) {
            if (!bool) {
                return ep.emit('login_error');
            }
            if (!user.active) {
                // 重新发送邮件激活
                var token = email + passhash + settings.cookieSecret;
                token = utility.md5(token);
                mail.sendActiveMail(email, token, loginname);
                res.status(403);
                req.flash('error', '此帐号还没有被激活，激活链接已发送到 ' + user.email + ' 邮箱，请查收。');
                return res.render('signin');
            }
            // store session cookie
            authMiddleware.gen_session(user, res);
            // check at some page just jump to home page
            res.redirect('/');
        }));
    })
};

exports.showSignup = function (req, res, next) {
    req.flash('info', '欢迎加入' + settings.siteName);
    res.render('signup');
};

exports.signup = function (req, res, next) {
    var loginname   = req.body.loginname.toLowerCase();
    var email       = req.body.email.toLowerCase();
    var pass        = req.body.pass;
    var rePass      = req.body.re_pass;

    loginname   = validator.trim(loginname);
    email       = validator.trim(email);
    pass        = validator.trim(pass);
    rePass      = validator.trim(rePass);

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('prop_err', function (msg) {
        res.status(422);
        res.json({code: 2, error: msg});
    });

    // 验证信息的正确性
    if ([loginname, email, pass, rePass].some(function (item) { return item === ''; })) {
        return ep.emit('prop_err', '信息不完整.');
    }

    if (loginname.length < 5) {
        return ep.emit('prop_err', '用户名至少需要5个字符.');
    }

    if (!tools.validateId(loginname)) {
        return ep.emit('prop_err', '用户名不合法.');
    }

    if (!validator.isEmail(email)) {
        return ep.emit('prop_err', '邮箱不合法.');
    }

    if (pass !== rePass) {
        return ep.emit('prop_err', '两次密码输入不一致.');
    }
    // 验证信息的正确性 END

    User.getUsersByQuery({'$or': [
        {'loginname': loginname},
        {'email': email}
    ]}, {}, function (err, users) {
        if (err) {
            return next(err);
        }
        if (users.length > 0) {
            return ep.emit('prop_err', '用户名或邮箱已被使用.');
        }

        tools.bhash(pass, ep.done(
            function (passhash) {
                User.newAndSave(loginname, loginname, passhash, email, '', false, function (err) {
                    if (err) {
                        return next(err);
                    }
                    // 发送激活邮件
                    var token = email + passhash + settings.cookieSecret;
                    token = utility.md5(token);
                    mail.sendActiveMail(email, token, loginname);
                    res.render('signup', {success: '欢迎加入 ' + settings.siteName + '！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。'});
                });
            }
        ));
    });
};

exports.activeAccount = function (req, res, next) {
    var key = validator.trim(req.query.key);
    var name = validator.trim(req.query.name);

    User.getUserByLoginName(name, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new Error('[ACTIVE_ACCOUNT] no such user: ' + name));
        }
        var passhash = user.pass;
        if (!user || utility.md5(user.email + user.pass + settings.cookieSecret) !== key) {
            return res.render('notify', {error: '信息有误，帐号无法被激活。'});
        }

        if (user.active) {
            return res.render('notify', {error: '帐号已经是激活状态。'});
        }
        user.active = true;
        user.save(function (err) {
            if (err) {
                return next(err);
            }
            res.render('notify', {success: '帐号已被激活，请登录'});
        });
    });
};