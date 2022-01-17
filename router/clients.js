const express = require("express");
const { check } = require("express-validator");
const app = express();
const bodyParser = require("body-parser");

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
  uploadImagenCliente,
  deleteOneClient,
} = require("../controllers/clients");
const { upload } = require("../helpers/multerSetUp");

const router = express.Router();

// apply the middleware
// router.use(validateJsonWebToken);

router.get("/", getAllClient);

router.post("/", createClient);

router.post("/upload", upload.single("image"), uploadImagenCliente);
router.put("/:id", validateJsonWebToken, updateClient);
router.get("/:id", validateJsonWebToken, getOneClient);
// router.delete("/:id", validateJsonWebToken, deleteWork);
router.delete("/", validateJsonWebToken, deleteAll);
router.delete("/:id", validateJsonWebToken, deleteOneClient);
module.exports = router;
