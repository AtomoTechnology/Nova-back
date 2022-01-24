const router = require('express').Router();
const outGoingController = require('./../controllers/outgoingsController');
const authController = require('../controllers/authController');

router.use(authController.protect);
router.use(authController.restrictTo('admin'));
router
  .route('/')
  .post(outGoingController.Create)
  .get(outGoingController.GetAll)
  .delete(outGoingController.DeleteAll);

router.route('/:id').get(outGoingController.GetOne).delete(outGoingController.DeleteOne);

module.exports = router;
