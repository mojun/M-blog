var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/ab', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/ab/1/*', function (req, res)  {
  console.log('test: -- >   ' + req.params[0] + '--' + req.params[1]);
  res.send('a');
});

module.exports = router;
