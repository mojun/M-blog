/**
 * Created by mojun on 4/17/16.
 */

exports.showNotify = function (req, res, next) {
    var success = req.query.success;
    var error = req.query.error;
    res.render('notify', {success: success, error: error});
};