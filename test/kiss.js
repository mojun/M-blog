/**
 * Created by test on 16/4/15.
 */

var kiss = {};
kiss.mua = function (time, callback) {
    setTimeout(function () {
        console.log('老婆: 你等' + time + '毫秒亲我一下');
        console.log('我: Mua');
        callback && callback.call(this, null);
    }, time);
};

kiss.mua(2000, function () {
    kiss.mua(3000, function () {
        kiss.mua(1000, function () {

        });
    });

});

function *test() {
    yield 1;
    yield 2;
    yield 3;
    console.log(11111);
}

var bar = test();

console.log(JSON.stringify(bar.next()));

console.log(JSON.stringify(bar.next()));

console.log(JSON.stringify(bar.next()));

console.log(JSON.stringify(bar.next()));

module.exports = kiss;