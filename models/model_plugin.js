/**
 * Created by test on 16/4/8.
 */
/**
 * Mongoose Plugins 给所有Model扩展功能
 * http://mongoosejs.com/docs/plugins.html
 * */

var tools = require('../common/tools');

module.exports = function (scheme) {

    // 文档多久之前创建
    scheme.methods.create_at_ago = function () {
        return tools.formatDate(this.create_at, true);
    };

    // 文档最后一次更新时间
    scheme.methods.update_at_ago = function () {
        return tools.formatDate(this.update_at, true);
    };
}