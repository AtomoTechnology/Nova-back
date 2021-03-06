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
  let filter = {};
  if (req.query.search)
    filter = {
      $or: [
        { name: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { dni: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
      ],
    };
  let query = User.find(filter);
  let queryTotal = User.find(filter);

  query = query.sort({ createAt: -1, name: 1 });

  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 50;
  // const skip = (page - 1) * limit;
  // query = query.skip(skip).limit(limit);
  let totalPage = 1;
  let page = 1;

  const total = await queryTotal.countDocuments();
  if (req.query.limit && req.query.page) {
    page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 30;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    totalPage = Math.ceil(total / limit);
  }

  const users = await query;

  res.status(200).json({
    status: 'success',
    page,
    totalPage,
    total: total,
    results: users.length,
    data: {
      users,
    },
  });
};

exports.SearchUser = async (req, res) => {
  let filter = {};

  if (!req.params.filter) return next(new AppError('Hace falta un filtro para buscar el usuario', 400));

  filter = {
    $or: [
      { name: { $regex: '.*' + req.params.filter + '.*', $options: 'i' } },
      { dni: { $regex: '.*' + req.params.filter + '.*', $options: 'i' } },
    ],
  };
  let users = await User.find(filter);

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
};

exports.GetMe = catchAsync(async (req, res, next) => {
  if (!req.params.id) req.params.id = req.user._id;
  next();
});
exports.GetTotalUsers = catchAsync(async (req, res, next) => {
  const total = await User.countDocuments();
  res.status(200).json({
    status: 'success',
    total,
  });
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

exports.updateUser = catchAsync(async (req, res, next) => {
  //create error for updating the passoword
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('Este no es la ruta para actualizar la contrasena', 400));
  }

  //update
  const filterBody = filterObj(req.body, 'name', 'email', 'dni', 'phone1', 'phone2', 'nota', 'direction');
  const updatedUser = await User.findByIdAndUpdate(req.params.id, filterBody, {
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

exports.UpdateAvatar = catchAsync(async (req, res, next) => {
  //create error for updating the passoword
  const { photo } = req.body;
  if (!photo) return next(new AppError('Para actualizar la imagen hace falta el campo photo', 400));

  if (!req.params.id) return next(new AppError('Necesitas el id del usuario', 400));

  await User.findByIdAndUpdate(
    req.params.id,
    { photo },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    message: 'Imagen actualizado con exito',
  });
});

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
    return next(new AppError('Esta routa no es para cambiar contrase??a. Por favor usa /updateMyPassword', 400));
  }

  //update
  const filterBody = filterObj(req.body, 'name', 'email', 'dni', 'phone1', 'phone2', 'nota', 'direction');
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

// exports.updatePasswordFormerUser = catchAsync(async (req, res, next) => {
//   const users = await User.find({ password: null });

//   for (let i = 0; i < users.length; i++) {
//     users[i].password = '12345678';
//     users[i].passwordConfirm = '12345678';
//     users[i].save({ validateBeforeSave: false });
//   }
//   // { createAt: { $gte: new Date('2022-01-10') },
//   // email: { $ne: null },}
//   res.status(201).json({
//     res: users.length,
//     status: 'success',
//     message: 'Contrase??as actualizadas con exito',
//   });
// });
