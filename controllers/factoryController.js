const AppError = require('../helpers/AppError');
const catchAsync = require('../helpers/catchAsync');

exports.CreateOne = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.GetAll = (model) =>
  catchAsync(async (req, res, next) => {
    const docs = await model.find();
    res.status(200).json({
      status: 'success',
      data: {
        data: docs,
      },
    });
  });

exports.GetOne = (model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await model.findById(id);
    if (!doc) return next(new AppError('No hay documento con ese ID!!!', 400));
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.DeleteOne = (model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await model.findByIdAndDelete(id);
    if (!doc) return next(new AppError('No hay documento con ese ID!!!', 400));
    res.status(200).json({
      status: 'success',
      data: null,
    });
  });

exports.DeleteAll = (model) =>
  catchAsync(async (req, res, next) => {
    await model.deleteMany();
    res.status(200).json({
      status: 'success',
      data: null,
    });
  });
