const express = require('express');
const { check } = require('express-validator');
const { fielsValidators } = require('../middlewares/fieldsValidators');
const { validateJsonWebToken } = require('../middlewares/jwtValidator');
const { isDate } = require('../helpers/isDate');
const OrdenWork = require('../models/OrdenWork');
const bodyParser = require('body-parser');
var fs = require('fs');
const pdf = require('html-pdf');
const authController = require('../controllers/authController');
const moment = require('moment');
const app = express();
const os = require('os');
const path = require('path');
const router = express.Router();
const templatePdf = require('../helpers/TemplatePdf');
const cors = require('cors');
// apply the middleware
// router.use(validateJsonWebToken);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());

router.get('/', authController.protect, async (req, res) => {
  try {
    const orders = await OrdenWork.find().populate('work');
    if (!orders) {
      return res.json({
        ok: false,
        msg: 'No hay ordenes para mostrar',
      });
    }
    return res.json({
      ok: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      ok: false,
      msg: 'Habla con el administrador...',
    });
  }
});
router.delete('/', async (req, res) => {
  try {
    const result = await OrdenWork.deleteMany();
    return res.status(201).json({
      ok: true,
      msg: 'Orders borrados con existos..',
    });
  } catch (error) {
    console.log(error);
    return res.json({
      ok: false,
      msg: 'Habla con el administrador...',
    });
  }
});

router.post('/:id', async (req, res) => {
  const orderId = req.params.id;
  const order = await OrdenWork.findById(orderId).populate({
    path: 'work ',
    populate: {
      path: 'cliente',
    },
  });
  if (!order) {
    return res.json({
      ok: false,
      msg: 'No existe orden con ese id',
    });
  }

  console.log(order);

  // var html = fs.readFileSync(`${__dirname}/pdf.html`, "utf8");

  // var options = { format: 'Letter' };
  // const desktopDir = path.join(os.homedir(), 'downloads');
  // console.log(desktopDir);
  // console.log('Good');

  // `${        order.work.codigo + '-' + Date.now() + '-' + order.work.cliente.name     }.pdf`
  // console.log(order);
  // var ord = {
  // 	id: 19829,
  // };

  pdf
    .create(templatePdf(order), {})
    .toFile(`${path.join(os.homedir(), 'downloads')}/james02.pdf`, function (err) {
      if (err) {
        console.log('reject');
        res.send(Promise.reject());
      }
      res.send(Promise.resolve());
      console.log('estoy Hilaire');
    });
});

router.get('/fetchPdf/download', (req, res) => {
  // console.log('estoy hilaire 2');
  res.sendFile(`${path.join(os.homedir(), 'downloads')}/james02.pdf`);
  // console.log('estoy hilaire 3');
});

// router.post("/uploadFile", loadFile);
// router.put("/:id", validateJsonWebToken, updateClient);
// router.get("/:id", validateJsonWebToken, getOneClient);

module.exports = router;
