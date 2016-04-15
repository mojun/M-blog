/**
 * Created by test on 16/4/15.
 */

var assert = require('assert');
var should = require('should');
var kiss = require('./kiss.js');
describe('Array', function () {
    describe('indexof()', function () {
        it('should return -1 ', function (done) {
            var x = [1,2,3].indexOf(2);
            console.log('xxx = ' + x);

            x.should.equal(1);
        });
    });
});

