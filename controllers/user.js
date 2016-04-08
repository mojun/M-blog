/**
 * Created by test on 16/4/8.
 */
var validator   = require('validator');
var eventproxy  = require('eventproxy');
var tools       = require('../common/tools');
var mail        = require('../common/mail');
var User        = require('../proxy/user');

exports.signup = function (req, res, next) {
    var loginname   = req.body.loginname.toLowerCase();
    var email       = req.body.email.toLowerCase();
    var pass        = req.body.pass;
    var rePass      = req.body.re_pass;
debugError('911');
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
                    debugInfo('9111');
                    // 发送激活邮件
                    mail.sendActiveMail(email, '', '');
                });
            }
        ));
    });
};