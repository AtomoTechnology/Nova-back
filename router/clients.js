const express = require("express");
const { check } = require("express-validator");
const app = express();

const { fielsValidators } = require("../middlewares/fieldsValidators");
const { validateJsonWebToken } = require("../middlewares/jwtValidator");
const { isDate } = require("../helpers/isDate");
const {
  createClient,
  getOneClient,
  getAllClient,
  updateClient,
  loadFile,
  deleteAll,
  uploadImagenCliente
} = require("../controllers/clients");

const router = express.Router();

// apply the middleware
// router.use(validateJsonWebToken);

router.get("/", getAllClient);

router.post(
  "/",
  [
    check("dni", "El dni es obligatorio").not().isEmpty(),
    check("phone1", "El telefono 1  es obligatorio").not().isEmpty(),
    check("name", "El nombre es obligatorio").not().isEmpty(),
    fielsValidators,
  ],
  createClient
);

router.post("/upload", uploadImagenCliente);
router.put("/:id", validateJsonWebToken, updateClient);
router.get("/:id", validateJsonWebToken, getOneClient);
// router.delete("/:id", validateJsonWebToken, deleteWork);
router.delete("/", validateJsonWebToken, deleteAll);
module.exports = router;
