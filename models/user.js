/**
 * Created by test on 16/4/8.
 */

var mongoose = require('mongoose');
var modelPlugin = require('./model_plugin');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: { type: String },
    loginname: { type: String },
    pass: { type: String },
    email: { type: String },

    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    active: { type: Boolean, default: false },
    avatar_url: {type: String},

    access_token: { type: String }
});

UserSchema.plugin(modelPlugin);

UserSchema.index({loginname: 1}, {unique: true});
UserSchema.index({email: 1}, {unique: true});
UserSchema.index({access_token: 1});

mongoose.model('User', UserSchema);