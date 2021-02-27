var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/send', (req, res, next) => {
  res.send({ title: 'Express' });
});

module.exports = router;
