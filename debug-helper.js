/**
 * Created by test on 16/4/8.
 */
var debug4Error = require("debug")("error");
var debug4Info  = require("debug")("info");

global.debugError   = debug4Error;
global.debugInfo    = debug4Info;