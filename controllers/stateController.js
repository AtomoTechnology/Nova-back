const State = require('../models/stateModel');
const catchAsync = require('./../helpers/catchAsync');
const factory = require('./factoryController');

exports.create = catchAsync(async (req, res) => {
  const state = await State.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      state,
    },
  });
});

exports.GetAll = catchAsync(async (req, res) => {
  const states = await State.find();
  return res.status(200).json({
    status: 'success',
    results: states.length,
    data: {
      states,
    },
  });
});

exports.DeleteAll = catchAsync(async (req, res) => {
  await State.deleteMany();
  res.status(204).json({
    ok: true,
    data: null,
  });
});

exports.GetByDesc = catchAsync(async (req, res) => {});
