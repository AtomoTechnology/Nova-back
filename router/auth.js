const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  getAllUsers,
  updateUser,
  createUser,
  doLogin,
  renewJwt,
} = require("../controllers/auth");
const { fielsValidators } = require("../middlewares/fieldsValidators");
const { validateJsonWebToken } = require("../middlewares/jwtValidator");

router.get("/users", getAllUsers);
router.post(
  "/createUser",
  [
    check("username", "el usuario debe tener más de 5 caracteres")
      .trim()
      .isLength({
        min: 6,
      }),
    check("password", "la contraseña debe tener más de 5 caracteres")
      .trim()
      .isLength({
        min: 6,
      }),
    check(
      "role",
      "El rol del usuario es obligatorio y deber tener mas de 3 caracteres!!!"
    )
      .not()
      .isEmpty()
      .isLength({ min: 4 }),
    fielsValidators,
  ],
  createUser
);
router.post("/updateUser", updateUser);
router.post(
  "/login",
  [
    check("username", "el usuario debe tener más de 5 caracteres")
      .trim()
      .isLength({
        min: 6,
      }),
    check("password", "la contraseña debe tener más de 5 caracteres")
      .trim()
      .isLength({
        min: 6,
      }),
    fielsValidators,
  ],
  doLogin
);

router.get("/renewJwt", validateJsonWebToken, renewJwt);
module.exports = router;
