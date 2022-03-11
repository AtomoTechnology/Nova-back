const AppError = require('../helpers/AppError');
const catchAsync = require('../helpers/catchAsync');
const Query = require('../models/queryModel');
const factory = require('./factoryController');

// exports.GetAll = factory.GetAll(Query);
exports.GetAll = catchAsync(async (req, res, next) => {
  let query = {};
  if (req.user.role === 'user') {
    // query = { user: req.user._id };
    req.query.user = req.user._id;
  }

  const docs = await Query.find(req.query);
  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: {
      data: docs,
    },
  });
});

exports.Delete = factory.DeleteOne(Query);
exports.GetById = factory.GetOne(Query);

exports.Create = catchAsync(async (req, res, next) => {
  const query = await Query.create({
    message: req.body.message,
    user: req.user._id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      query,
    },
  });
});

exports.ResponseQuery = catchAsync(async (req, res, next) => {
  const idQuery = req.params.id;
  const query = await Query.findById(idQuery);
  if (!query) return next(new AppError('No hay consultas con ese id', 400));

  const response = {};
  response.message = req.body.message;
  response.user = req.user._id;
  query.responses.push(response);
  const querySave = await query.save();

  res.status(201).json({
    status: 'success',
    data: {
      query: querySave,
    },
  });
});

exports.UpdateRead = catchAsync(async (req, res, next) => {
  const idQuery = req.params.id;
  const query = await Query.findById(idQuery);
  if (!query) return next(new AppError('No hay consultas con ese id', 400));

  const q = await Query.findByIdAndUpdate(idQuery, req.body, {
    new: true,
  });

  res.status(201).json({
    status: 'success',
    data: {
      query: q,
    },
  });
});
