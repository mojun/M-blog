/**
 * Created by test on 16/4/8.
 */
var User = require('../models').User;
var uuid = require('node-uuid');

/**
 * 根据用户ID,查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getUserById = function (id, callback) {
    if (!id) {
        return callback();
    }
    User.findOne({_id: id}, callback);
};

/**
 * 根据邮箱，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} email 邮箱地址
 * @param {Function} callback 回调函数
 */
exports.getUserByMail = function (email, callback) {
    User.findOne({email: email}, callback);
};

/**
 * 根据登录名查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} loginName 登录名
 * @param {Function} callback 回调函数
 */
exports.getUserByLoginName = function (loginName, callback) {
    User.findOne({'loginname': loginName}, callback);
};

/**
 * 创建用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param name
 * @param loginname
 * @param pass
 * @param email
 * @param avatar_url
 * @param active
 * @param callback
 */
exports.newAndSave = function (name, loginname, pass, email, avatar_url, active, callback) {
    var user         = new User();
    user.name        = loginname;
    user.loginname   = loginname;
    user.pass        = pass;
    user.email       = email;
    user.avatar      = avatar_url;
    user.active      = active || false;
    user.accessToken = uuid.v4();

    user.save(callback);
};

/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getUsersByQuery = function (query, opt, callback) {
    User.find(query, '', opt, callback);
};