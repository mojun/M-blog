var express = require('express');
var router = express.Router();
var user = require('../controllers/user.js');

/* GET users listing. */
router.get('/signup', user.showSignup);
router.post('/signup', user.signup);
router.get('/login', user.showLogin);
router.post('/login', user.login);

module.exports = router;
