const catchAsync = require('../helpers/catchAsync');
const OutGoing = require('../models/outGoingModel');
const factory = require('./factoryController');
const moment = require('moment');

exports.Create = factory.CreateOne(OutGoing);
exports.GetOne = factory.GetOne(OutGoing);
exports.DeleteOne = factory.DeleteOne(OutGoing);
exports.DeleteAll = factory.DeleteAll(OutGoing);

exports.GetAll = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const docs = await OutGoing.find({
    date: { $gte: moment(startDate).toDate(), $lte: moment(endDate).add(1, 'days').toDate() },
  });

  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: {
      data: docs,
    },
  });
});
