/**
 * Created by test on 16/4/8.
 */
var settings = require('../settings');
var mailer = require('nodemailer');
var util = require('util');
var transporter = mailer.createTransport(settings.mail_opts);

function sendMail (data){
    transporter.sendMail(data, function(err) {
        if (err) {
            debugError(err);
        }
    });
}

exports.sendMail = sendMail;

exports.sendActiveMail = function (who, token, name) {
    var from    = util.format('%s <%s>', 'TTT', settings.mail_opts.auth.user);
    var to      = who;
    var subject = 'MJ社区帐号激活';
    var html = '<p>您好激活</p>';
    sendMail({
        from: from,
        to: to,
        subject: subject,
        html: html
    });
};