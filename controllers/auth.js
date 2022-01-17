const { response } = require('express');
const { validationResult, body } = require('express-validator');
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../helpers/jwt');

const getAllUsers = (req, res = response) => {
  res.json([
    {
      name: 'name',
      dni: 6865875,
      direction: 'ssarmiento',
    },
    {
      name: 'name1',
      dni: 067706,
      direction: 'españa',
    },
  ]);
};

// create a user
const createUser = async (req, res = response) => {
  //   console.log(req.body);
  const { username, password, role } = req.body;
  console.log(role, username);
  try {
    let user = await User.findOne({ username });
    // console.log(usuario);
    if (user) {
      return res.status(500).json({
        ok: false,
        msg: 'Ya existe este nombre de usuario!!! Intente con otra por favor ',
      });
    }
    // console.log(role);
    // if (role.length < 3 || !role) {
    //   return res.status(500).json({
    //     ok: false,
    //     msg:
    //       "el role del usuario es obligatorio y deber tener mas de 3 caracteres ",
    //   });
    // }
    user = new User(req.body);
    // encrypt password before store it
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(password, salt);

    //save the user
    await user.save();

    //generate the jwb
    const token = await generateToken(user.id, user.username, user.role);

    res.status(201).json({
      ok: true,
      msg: 'Usuario registrado con exito...',
      uid: user.id,
      username: user.username,
      role: user.role,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Comunica con el administrador...',
    });
  }
};

// update a user

const updateUser = (req, res = response) => {
  res.json({
    name: 'name',
    dni: 6865875,
    direction: 'ssarmiento',
    msg: 'uodate user',
  });
};
const renewJwt = async (req, res = response) => {
  const { uid, username, role } = req;
  console.log('data', username, uid, role);
  //generate an other token
  const token = await generateToken(uid, username, role);
  res.json({
    ok: true,
    uid,
    username,
    role,
    token,
  });
};

//do the login
const doLogin = async (req, res = response) => {
  const { username, password } = req.body;

  try {
    //find the user
    const user = await User.findOne({ username });

    //validate if he exist
    if (!user) {
      return res.status(500).json({
        ok: false,
        msg: 'Usuario y/o contraseña incorrecta!!!',
      });
    }

    //if the username exist compare the passwords and validate the result
    let validatePassword = bcrypt.compareSync(password, user.password);
    if (!validatePassword) {
      return res.status(500).json({
        ok: false,
        msg: 'Usuario y/o contraseña incorrecta!!!',
      });
    }

    // if everyThing is okay sign in the user
    //generate the jwb
    const token = await generateToken(user.id, user.username, user.role);
    res.status(201).json({
      ok: true,
      msg: 'user signed in',
      uid: user.id,
      username: user.username,
      role: user.role,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Comunica con el administrador...',
    });
  }
};

// export the modules
module.exports = {
  getAllUsers,
  updateUser,
  createUser,
  doLogin,
  renewJwt,
};
