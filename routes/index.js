var express = require('express');
const { set_hero_stats, get_hero_stats, upload_hero_image, get_hero_image } = require('../controllers/hero');
var router = express.Router();

router.post('/setHeroStats', set_hero_stats);
router.get('/getHeroStats', get_hero_stats);
router.post('/uploadHeroImage', upload_hero_image);
router.get('/getHeroImage', get_hero_image);

module.exports = router;
