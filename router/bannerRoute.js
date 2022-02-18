const bannerController = require('../controllers/bannerController');
const router = require('express').Router();
router.route('/').get(bannerController.GetAll).post(bannerController.Create);

module.exports = router;
