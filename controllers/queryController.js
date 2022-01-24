const AppError = require('../helpers/AppError');
const catchAsync = require('../helpers/catchAsync');
const Query = require('../models/queryModel');
const factory = require('./factoryController');

exports.GetAll = factory.GetAll(Query);
exports.Delete = factory.DeleteOne(Query);

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
