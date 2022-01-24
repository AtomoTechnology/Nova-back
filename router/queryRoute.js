const express = require('express');
const router = express.Router();
const queryController = require('./../controllers/queryController');
const authController = require('./../controllers/authController');

router.use(authController.protect);

router
  .route('/')
  .get(queryController.GetAll)
  .post(authController.restrictTo('user'), queryController.Create);
router
  .route('/:id')
  .delete(authController.restrictTo('admin'), queryController.Delete)
  .patch(authController.restrictTo('admin', 'tecnico'), queryController.ResponseQuery);

module.exports = router;
