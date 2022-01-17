const express = require('express');
const stateController = require('./../controllers/stateController');

const router = express.Router();

router.post('/', stateController.create);

router.get('/', stateController.GetAll);
router.get('/desc', stateController.GetByDesc);

router.delete('/', stateController.DeleteAll);

module.exports = router;
