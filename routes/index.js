var express = require('express');
const { set_hero_stats, get_hero_stats, upload_hero_image, get_hero_image } = require('../controllers');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/setHeroStats', set_hero_stats);
router.get('/getHeroStats', get_hero_stats);
router.post('/uploadHeroImage', upload_hero_image);
router.get('/getHeroImage', get_hero_image);

module.exports = router;
