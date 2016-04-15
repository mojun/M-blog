var express = require('express');
var router = express.Router();
var user = require('../controllers/user.js');

/* GET users listing. */
router.get('/signup', user.showSignup);

module.exports = router;
