const bannerController = require('../controllers/bannerController');
const router = require('express').Router();
router.route('/').get(bannerController.GetAll).post(bannerController.Create);
router.delete('/:id', bannerController.Delete);

module.exports = router;
