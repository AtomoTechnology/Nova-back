const router = require('express').Router();
const workController = require('../controllers/workController');
const authController = require('../controllers/authController');

router.use(authController.protect);

// router.use(authController.restrictTo('admin', 'tecnico'));
router.get('/client/:idClient', workController.getWorksClient);
router.get('/done/', workController.ConfirmWork);
router.get('/stats/', workController.WorkStats);
router.get('/updateFormerStates', workController.UpdateStatesToArray);

router
  .route('/')
  .get(authController.restrictTo('admin', 'tecnico'), workController.getAllWorks)
  .post(authController.restrictTo('admin', 'tecnico'), workController.createWork);

router
  .route('/:id')
  .get(workController.getOneWork)
  .patch(authController.restrictTo('admin', 'tecnico'), workController.updateWork)
  .delete(authController.restrictTo('admin', 'tecnico'), workController.deleteWork);

router.delete('/', workController.deleteAll);
router.route('/generateOrder/:id').post(workController.GenerateOrder);
router.route('/download/Order').get(workController.DownloadOrder);

// router.post('/uploadFileWork', workController.uploadImagenWork);
// router.get('/historialWork/all', workController.getWorksByDataAndTurnedinState);

module.exports = router;
