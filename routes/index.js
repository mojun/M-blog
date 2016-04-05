var express = require('express');
var router = express.Router();

console.log('index dirname: ' + __dirname);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
