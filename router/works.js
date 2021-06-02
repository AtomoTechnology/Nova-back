const express = require("express");
const { check } = require("express-validator");
const app = express();
const {
  getAllWorks,
  createWork,
  updateWork,
  deleteWork,
  getOneWork,
  getWorksClient,
  deleteAll,
  loadFile,
  getWorksByDataAndTurnedinState,
} = require("../controllers/works");
const { fielsValidators } = require("../middlewares/fieldsValidators");
const { validateJsonWebToken } = require("../middlewares/jwtValidator");
const { isDate } = require("../helpers/isDate");

const router = express.Router();

// apply the middleware
// app.use(validateJsonWebToken);
// router.use(validateJsonWebToken);
router.get("/", getAllWorks);

router.post(
  "/",
  [
    check("marca", "La marca es obligatoria").not().isEmpty(),
    check("modelo", "El modelo es obligatorio").not().isEmpty(),
    check("emei", "El Emei es obligatorio").not().isEmpty(),
    check("observaciones", "La observacion es obligatoria").not().isEmpty(),
    check("estado", "El estado es obligatoria").not().isEmpty(),
    check("fechaInicio", "la fecha de inicio es obligatoria").custom(isDate),
    fielsValidators,
  ],
  createWork
);
router.put("/:id", updateWork);
router.get("/:id", getOneWork);
router.get("/client/:idClient", getWorksClient);
router.delete("/:id", deleteWork);
router.delete("/", deleteAll);
router.post("/uploadFileWork", loadFile);
router.get("/historialWork/all", getWorksByDataAndTurnedinState);
module.exports = router;
