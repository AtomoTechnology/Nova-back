const catchAsync = require('../helpers/catchAsync');
const Banner = require('../models/banner');

exports.GetAll = catchAsync(async (req, res, next) => {
  const banners = await Banner.findAll();

  res.json({
    status: 'success',
    resuuls: banners.length,
    data: {
      banners,
    },
  });
});

exports.Create = catchAsync(async (req, res, next) => {
  for (let i = 0; i < req.body.photos.length; i++) {
    console.log(req.body.photos[i]);
    await Banner.create(req.body.photos[i]);
  }

  res.json({
    status: 'success',
  });
});
