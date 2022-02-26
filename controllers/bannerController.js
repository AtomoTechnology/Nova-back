const AppError = require('../helpers/AppError');
const catchAsync = require('../helpers/catchAsync');
const Banner = require('../models/banner');

exports.GetAll = catchAsync(async (req, res, next) => {
  const banners = await Banner.findAll({
    order: [['id', 'DESC']],
  });

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
exports.Delete = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const banner = await Banner.destroy({ where: { id } });
  if (banner === 0) return next(new AppError('No existe banner con ese id', 400));

  res.status(200).json({
    status: 'success',
  });
});
