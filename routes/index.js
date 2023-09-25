var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mobile Phone Usage' });
});

router.route('/about')
.get((req,res,next) => {
  res.render('about', { title: 'About Phone Usage' });
});

router.route('/help')
.get((req,res,next) => {
  res.render('help', { title: 'Phone Usage Help' });
});

module.exports = router;
