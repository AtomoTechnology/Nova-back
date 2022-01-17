// const AppError = require('../helpers/AppError');
const AppError = require('../helpers/AppError');
const catchAsync = require('../helpers/catchAsync');
const User = require('./../models/userModel');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().sort({ createAt: -1, name: 1 });

  res.status(500).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
};

exports.GetMe = catchAsync(async (req, res, next) => {
  if (!req.params.id) req.params.id = req.user._id;
  next();
});
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('No existe un usuario con este id...', 400));
  return res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    message: 'were implements that router update',
  });
};

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError('No existe un usuario con este id...', 400));

  return res.status(200).json({
    status: 'success',
    message: 'Usuario borrado con exito',
    data: null,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //create error for updating the passoword
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('This route is not for password update. Please use /updateMyPassword', 400)
    );
  }

  //update
  const filterBody = filterObj(
    req.body,
    'name',
    'email',
    'dni',
    'phone1',
    'phone2',
    'nota',
    'direction'
  );
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updatePasswordFormerUser = catchAsync(async (req, res, next) => {
  const users = await User.find({ password: null });

  for (let i = 0; i < users.length; i++) {
    users[i].password = '12345678';
    users[i].passwordConfirm = '12345678';
    users[i].save({ validateBeforeSave: false });
    console.log('save..', i);
  }
  // { createAt: { $gte: new Date('2022-01-10') },
  // email: { $ne: null },}
  res.status(201).json({
    res: users.length,
    status: 'success',
    message: 'Contraseñas actualizadas con existosss',
  });
});
