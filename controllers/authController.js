const crypto = require('crypto');
const { promisify } = require('util');
const catchAsync = require('../helpers/catchAsync');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../helpers/AppError');
const sendEmail = require('../helpers/email');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN_NOVA, {
    expiresIn: process.env.SECRET_TOKEN_NOVA_INSPIRE_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = createToken(user._id);
  const cookieOptions = {
    expiresIn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.renewToken = catchAsync(async (req, res, next) => {
  createSendToken(req.user, 200, res);
});

exports.signUp = catchAsync(async (req, res, next) => {
  //bad practice
  const exist = await User.findOne({ $or: [{ dni: req.body.dni }, { email: req.body.email }] });
  console.log(exist);

  if (exist) return next(new AppError('Este usuario ya existe. Por favor Inicia Sesion con tu dni y contraseña.', 500));
  const newUser = await User.create(req.body);
  // const newUser = await User.create({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   passwordConfirm: req.body.passwordConfirm,
  // });

  //create token
  createSendToken(newUser, 201, res);
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { dni, password } = req.body;

  //validate email and password
  if (!dni || !password) {
    return next(new AppError('Ingrese su DNI y/o su contraseña por favor', 400));
  }

  const user = await User.findOne({ dni }).select('+password');

  //validate user and password
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('DNI y/o Contraseña incorrecta.', 401));
  }
  // console.log(user);
  req.user = user;

  //create token
  createSendToken(user, 200, res);
});

exports.delete = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      user: null,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //getting token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  //validate token
  if (!token) {
    return next(new AppError('No estás loggeado . Por favor Inicia session. ', 401));
  }

  //vaerify token
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_TOKEN_NOVA);

  //check if user exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('Este usuario ya no existe ', 401));
  }

  //check if user change the password
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('Este usuario cambió su contraseña recientemente . Por favor inicia session.', 401));
  }

  //grant the access
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('No tiene permiso para realizar esta accion.', 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get the user and validate it
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('This is no user with this email ..', 404));
  }

  //2) generate the random  token
  const resetToken = user.createPasswordResetToken();

  // we just modify data from the object  we have to save it
  await user.save({ validateBeforeSave: false }); //

  //send email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `¿Forgot your password ? click on this link : ${resetURL} to resetyour password.\n if you did forget your password ignore this email`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 mn)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was a problem sending the email ', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //Get Uer based on the token
  const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('This is no user for this token. Token invalid or expired ..', 404));
  }

  //validate user and token
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //Log in user again
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Get the user
  const user = await User.findOne({ email: req.user.email }).select('+password');

  //check password
  if (!user || !(await user.checkPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Contraseña invalida', 401));
  }

  //update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //User.findByIdAndUpdate() will not work

  //log in user
  createSendToken(user, 200, res);
});
