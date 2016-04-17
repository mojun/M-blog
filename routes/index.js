var express = require('express');
var router = express.Router();
var user = require('../controllers/user.js');
var index = require('../controllers/index.js');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'xx管理系统' });
});

router.get('/notify', index.showNotify);

router.post('/mail', user.signup);


module.exports = router;
