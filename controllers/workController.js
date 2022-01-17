const State = require('../models/State');
const Work = require('../models/workModel');
const Work_State = require('../models/Work_State');
const { generateCodigoWork } = require('../helpers/generateCodigoWork');
const moment = require('moment');
const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/AppError');
const pdf = require('html-pdf');
const path = require('path');
const os = require('os');
const templatePdf = require('../helpers/TemplatePdf');

// const OrdenWork = require('../models/OrdenWork');
// const { cloudinary } = require('../helpers/cloudinary');
// const fs = require('fs');
// const fileUpload = require("express-fileupload");

exports.createWork = catchAsync(async (req, res, next) => {
  const newWork = new Work(req.body);
  do {
    newWork.codigo = generateCodigoWork();
  } while (await Work.findOne({ codigo: newWork.codigo }).limit(1));
  console.log(newWork);
  const state = await State.findById(newWork.estado);
  console.log(state);
  newWork.states.push({ nombre: state.name });

  // console.log(newWork);
  const work = await newWork.save();
  // return;

  // const w = await Work.findById({ _id: work._id }).populate('estado');

  // const ws = new Work_State();
  // ws.work = work._id;
  // ws.state.push({ nombre: w.estado.name, fecha: moment() });
  // await ws.save();

  res.status(201).json({
    status: 'success',
    data: {
      work,
    },
  });
});

exports.getAllWorks = catchAsync(async (req, res, next) => {
  let query = Work.find();

  query = query.sort('-fechaInicio precio'); //

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);
  const totalWork = await Work.countDocuments();
  const numberPage = Math.ceil(totalWork / limit);

  const works = await query;

  res.json({
    status: 'success',
    page: numberPage,
    results: works.length,
    total: totalWork,
    data: {
      works,
    },
  });
});

exports.getOneWork = catchAsync(async (req, res, next) => {
  const workId = req.params.id;
  const work = await Work.findById(workId);

  if (!work) {
    return res.status(404).json({
      ok: false,
      msg: 'No se encontró trabajo con ese id..',
    });
  }

  res.status(201).json({
    ok: true,
    work,
  });
});

exports.getWorksClient = catchAsync(async (req, res, next) => {
  const idClient = req.params.idClient;

  const works = await Work.find({ cliente: idClient }).sort('-fechaInicio');

  if (!works) return next(new AppError('No existe usuario con ese ID', 404));
  if (works.length === 0) return next(new AppError('No se encontró trabajo para es usuario', 404));

  res.status(201).json({
    status: 'success',
    results: works.length,
    data: {
      works,
    },
  });
});

exports.updateWork = catchAsync(async (req, res, next) => {
  const workId = req.params.id;
  const work = await Work.findById(workId);

  if (!work) return next(new AppError('No se encontró trabajo con ese id', 404));
  const newWork = { ...req.body };
  const stateToModify = await State.findById(newWork.estado);

  if (stateToModify != null) {
    if (stateToModify.name === 'Entregado') {
      newWork.fechaFin = moment.now();
    }
  }

  console.log('117', work.estado._id, newWork.estado);
  if (work.estado._id != newWork.estado) {
    console.log('siiiiiiiiiii');
    const state = await State.findById(newWork.estado);
    work.states.push({ nombre: state.name });
    newWork.states = work.states;
  }

  const updateWork = await Work.findByIdAndUpdate(workId, newWork, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      work: updateWork,
    },
  });
});

exports.deleteWork = catchAsync(async (req, res, next) => {
  const workId = req.params.id;
  const work = await Work.findById(workId);
  if (!work) return next(new AppError('No se encontró trabajo con ese id', 404));

  //found all the work_state before delete
  const workState = await Work_State.find({ work: workId });
  console.log(workState);
  if (workState.length > 0) {
    console.log('no entraaaa');
    await Work_State.deleteOne({ work: workId });
  }
  console.log('sigueeeeeee');

  await Work.findByIdAndDelete(workId);

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.deleteAll = catchAsync(async (req, res, next) => {
  await Work.deleteMany();

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.GenerateOrder = catchAsync(async (req, res, next) => {
  const workId = req.params.id;
  console.log('hello');
  const work = await Work.findById(workId);

  if (!work) return next(new AppError('No se encontró trabajo con ese id', 404));

  pdf
    .create(templatePdf(work), {})
    .toFile(`${path.join(os.homedir(), 'downloads')}/order.pdf`, function (err) {
      if (err) {
        res.send(Promise.reject());
      }
      res.send(Promise.resolve());
    });
});

exports.DownloadOrder = catchAsync(async (req, res, next) => {
  res.sendFile(`${path.join(os.homedir(), 'downloads')}/order.pdf`);
});

exports.ConfirmWork = catchAsync(async (req, res, next) => {
  const state = await State.findOne({ name: 'Terminado' });
  const confirmWork = await Work.find({ estado: state._id });

  res.status(200).json({
    status: 'success',
    results: confirmWork.length,
    data: {
      works: confirmWork,
    },
  });
});
exports.WorkStats = catchAsync(async (req, res, next) => {
  let stats = await Work.aggregate([
    {
      $group: {
        _id: 'null',
        quantity: { $sum: 1 },
        averageEarn: { $avg: '$total' },
        minPrice: { $min: '$total' },
        maxPrice: { $max: '$total' },
        totalEarned: { $sum: '$total' },
      },
    },
  ]);
  // stats = await stats.populate( { path: 'estado' });

  res.status(200).json({
    status: 'success',
    data: {
      data: stats,
    },
  });
});
exports.UpdateStatesToArray = catchAsync(async (req, res, next) => {
  const formerStates = await Work_State.find();

  // formerStates.forEach(async (fs) => {
  //   await Work.findByIdAndUpdate(fs.work, { states: fs.state });
  // });

  // const works = await Work.find();

  res.status(200).json({
    status: 'success',
    res: formerStates.length,
    // works,
  });
});

// const updateStateWork = async (req, res, next) => {
//   // get the id form the url
//   const workId = req.params.id;

//   try {
//     //get the work by id
//     const work = await Work.findById(workId);
//     // console.log(work);
//     if (!work) {
//       return res.status(404).json({
//         ok: false,
//         msg: 'no se encontró trabajo con ese id..',
//       });
//     }
//     const newWork = { ...req.body };
//     const stateToModify = await State.findById(newWork.estado);
//     if (stateToModify != null) {
//       console.log(stateToModify, moment.now());
//       if (stateToModify.name === 'Entregado') {
//         newWork.fechaFin = moment.now();
//       }
//     }
//     // console.log(newWork);

//     let descuento = (parseInt(newWork.precio) * parseInt(newWork.descuento)) / 100;
//     let recargo = (parseInt(newWork.precio) * parseInt(newWork.recargo)) / 100;
//     newWork.total = parseInt(newWork.precio) + recargo - descuento;

//     const updateWork = await Work.findByIdAndUpdate(workId, newWork, {
//       new: true,
//     }).populate('cliente estado');
//     console.log('update work');
//     console.log(updateWork);

//     if (work.estado != newWork.estado) {
//       const wsu = await Work_State.findOne({ work: workId }).limit(1);
//       wsu.state.push({ nombre: updateWork.estado.name, fecha: Date() });
//       await Work_State.findByIdAndUpdate(wsu._id, wsu, {
//         new: true,
//       });
//     }

//     res.status(201).json({
//       ok: true,
//       updateWork,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       ok: false,
//       msg: 'habla con el administrador ',
//     });
//   }
// };

// const loadFile = (req, res = response) => {
//   if (req.files === null || req.files === undefined) {
//     return res.json({
//       ok: false,
//       msg: 'hubo un problema al subir la imagen',
//       files: req.files,
//     });
//   }
//   const imagenes = req.files.files;
//   console.log(imagenes.length, typeof imagenes);
//   if (imagenes.length >= 2) {
//     for (let index = 0; index < imagenes.length; index++) {
//       imagenes[index].name =
//         new Date().getTime() +
//         Math.floor(Math.random() * (1000 - 9999) + 9999) +
//         imagenes[index].name;
//     }
//     const imagenFormat = [];
//     const url = 'C:/Users/JHMesseroux/Desktop/NicoProject/taller-nico/public/assets/img/works/';

//     if (!fs.existsSync(url)) {
//       // console.log(" no existe...");
//       fs.mkdirSync(url, 0744);
//     }

//     for (let index = 0; index < imagenes.length; index++) {
//       let img = {
//         fileName: imagenes[index].name,
//         filePath: `${url}${imagenes[index].name}`,
//         fileSize: imagenes[index].size,
//         fileMineType: imagenes[index].mineyype,
//       };

//       imagenes[index].mv(`${url}${imagenes[index].name}`, (err) => {
//         if (err) {
//           console.log(err);
//           return res.status(400).json({
//             err,
//             msg: 'No se pudo subir la imagen',
//           });
//         }
//       });

//       imagenFormat.push(img);
//     }
//     return res.json({
//       ok: true,
//       msg: 'imagenes subidos con existos',
//       imagenFormat,
//     });
//   } else {
//     return res.json({
//       ok: true,
//     });
//   }
// };

// const uploadImagenWork = async (req, res = response) => {
//   try {
//     // console.log(req.body);
//     const r = [];
//     for (let index = 0; index < req.body.length; index++) {
//       const resp = await cloudinary.uploader.upload(
//         req.body[index],
//         {
//           upload_preset: 'NovaTech',
//         },
//         function (error, result) {
//           if (error) {
//             return res.status(500).json({
//               ok: false,
//               msg: 'Error al guardar la imagen!',
//             });
//           }
//           console.log(result);

//           let partial = {
//             public_id: result.public_id,
//             format: result.format,
//             size: result.bytes,
//             url: result.url,
//           };
//           r.push(partial);
//         }
//       );
//     }

//     res.status(201).json({
//       ok: true,
//       pathImg: r,
//     });
//   } catch (error) {}
// };

// const getWorksByDataAndTurnedinState = async (req, res) => {
//   try {
//     const works = await Work.find({
//       estado: '608d831076b79112c456a50b',
//     })
//       .populate('cliente estado')
//       .sort('fechaInicio');
//     console.log(works);
//     return res.json({
//       ok: true,
//       works,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       ok: false,
//       msg: 'habla con el administrador....',
//     });
//   }
// };

// module.exports = {
//   getAllWorks,
//   createWork,
//   deleteWork,
//   updateWork,
//   getOneWork,
//   getWorksClient,
//   deleteAll,
//   // loadFile,
//   // getWorksByDataAndTurnedinState,
//   // uploadImagenWork,
// };
