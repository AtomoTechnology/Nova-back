const router = require('express').Router();
const stateController = require('../controllers/stateController');

router
  .route('/')
  .post(stateController.create)
  .get(stateController.GetAll)
  .delete(stateController.DeleteAll);

router.get('/desc', stateController.GetByDesc);

module.exports = router;
