/**
 * Created by test on 16/4/8.
 */
const moment = require('moment'),
    bcrypt = require('bcryptjs');
moment.locale('zh-cn'); // 中文

exports.formatDate = function (date, friendly) {
    date = moment(date);

    if (friendly) {
        return date.fromNow();
    } else {
        return date.format('YYYY-MM-DD HH:mm');
    }
};

// 判断是否是合法的用户名
exports.validateId = function (str) {
    return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};

// 密码加密
exports.bhash = function (str, callback) {
    bcrypt.hash(str, 10, callback);
};

exports.bcompare = function (str, hash, callback) {
    bcrypt.compare(str, hash, callback);
};