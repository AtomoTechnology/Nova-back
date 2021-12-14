const { response, json } = require('express');
const OrdenWork = require('../models/OrdenWork');

const State = require('../models/State');
const Work = require('../models/Works');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const Work_State = require('../models/Work_State');
const { generateCodigoWork } = require('../helpers/generateCodigoWork');
const moment = require('moment');
const { cloudinary } = require('../helpers/cloudinary');
const { findByIdAndDelete } = require('../models/Work_State');

const createWork = async (req, res = response) => {
	// console.log(req.body);
	const workInicial = new Work(req.body);
	try {
		// workInicial.numero = Work.find().sort({ $natural: -1 }).limit(1);
		do {
			workInicial.codigo = generateCodigoWork();
			console.log('validando codigo');
		} while (await Work.findOne({ codigo: workInicial.codigo }).limit(1));
		// const validate = await Work.findOne({codigo: workInicial.codigo}).limit(1);

		let descuento =
			(parseInt(workInicial.precio) * parseInt(workInicial.descuento)) / 100;
		let recargo =
			(parseInt(workInicial.precio) * parseInt(workInicial.recargo)) / 100;
		workInicial.total = parseInt(workInicial.precio) + recargo - descuento;

		const work = await workInicial.save();
		console.log(work);

		//create the order
		const order = new OrdenWork();
		order.work = work._id;
		const orderSave = await order.save();

		const w = await Work.findById({ _id: work._id }).populate('estado');
		const ws = new Work_State();
		ws.work = work._id;
		ws.state.push({ nombre: w.estado.name, fecha: moment() });
		console.log(ws);
		ws.save();

		return res.status(201).json({
			ok: true,
			work,
			orderSave,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: 'habla con el administrador ',
		});
	}
};

const getAllWorks = async (req, res = response) => {
	const works = await Work.find()
		.sort({ fechaInicio: -1 })
		.populate('cliente estado');
	res.json({
		ok: true,
		works,
	});
};

const getOneWork = async (req, res = response) => {
	const workId = req.params.id;
	try {
		const work = await Work.findById(workId).populate('cliente estado');
		if (!work) {
			return res.status(404).json({
				ok: false,
				msg: 'No se encontró trabajo con ese id..',
			});
		}
		res.json({
			ok: true,
			work,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: 'Habla con el administrador ',
		});
	}
};

const getWorksClient = async (req, res = response) => {
	const idClient = req.params.idClient;
	console.log(idClient);
	// return res.json({
	//   ok: true,
	//   idClinet,
	// });
	try {
		const works = await Work.find({ cliente: idClient }).populate(
			'cliente estado'
		);
		if (!works) {
			return res.status(404).json({
				ok: false,
				msg: 'No existe cliente con ese ID..',
			});
		}
		if (works.length === 0) {
			return res.status(404).json({
				ok: false,
				msg: 'No se encontró trabajos para ese cliente.',
			});
		}
		return res.status(201).json({
			ok: true,
			works,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: 'Habla con el administrador ',
		});
	}
};

const updateWork = async (req, res = response) => {
	// get the id form the url
	const workId = req.params.id;
	console.log('updateddd');

	try {
		//get the work by id
		const work = await Work.findById(workId);
		// console.log(work);
		if (!work) {
			return res.status(404).json({
				ok: false,
				msg: 'no se encontró trabajo con ese id..',
			});
		}
		// console.log(work);
		const newWork = { ...req.body };
		const stateToModify = await State.findById(newWork.estado);

		if (stateToModify != null) {
			// console.log(stateToModify, moment.now());
			if (stateToModify.name === 'Entregado') {
				newWork.fechaFin = moment.now();
			}
		}
		// console.log(newWork);
		let descuento = 0;
		let recargo = 0;
		if (newWork.descuento != null) {
			descuento =
				(parseInt(newWork.precio) * parseInt(newWork.descuento)) / 100;
		}
		if (newWork.recargo != null) {
			recargo = (parseInt(newWork.precio) * parseInt(newWork.recargo)) / 100;
		}
		newWork.total = parseInt(newWork.precio) + recargo - descuento;
		console.log('hasta ahi');
		console.log(newWork);
		const updateWork = await Work.findByIdAndUpdate(workId, newWork, {
			new: true,
		}).populate('cliente estado');
		console.log('update work');
		console.log(updateWork);

		if (work.estado != newWork.estado) {
			const wsu = await Work_State.findOne({ work: workId }).limit(1);
			wsu.state.push({ nombre: updateWork.estado.name, fecha: Date() });
			await Work_State.findByIdAndUpdate(wsu._id, wsu, {
				new: true,
			});
		}

		res.status(201).json({
			ok: true,
			updateWork,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: 'habla con el administrador ',
		});
	}
};

const updateStateWork = async (req, res = response) => {
	// get the id form the url
	const workId = req.params.id;

	try {
		//get the work by id
		const work = await Work.findById(workId);
		// console.log(work);
		if (!work) {
			return res.status(404).json({
				ok: false,
				msg: 'no se encontró trabajo con ese id..',
			});
		}
		const newWork = { ...req.body };
		const stateToModify = await State.findById(newWork.estado);
		if (stateToModify != null) {
			console.log(stateToModify, moment.now());
			if (stateToModify.name === 'Entregado') {
				newWork.fechaFin = moment.now();
			}
		}
		// console.log(newWork);

		let descuento =
			(parseInt(newWork.precio) * parseInt(newWork.descuento)) / 100;
		let recargo = (parseInt(newWork.precio) * parseInt(newWork.recargo)) / 100;
		newWork.total = parseInt(newWork.precio) + recargo - descuento;

		const updateWork = await Work.findByIdAndUpdate(workId, newWork, {
			new: true,
		}).populate('cliente estado');
		console.log('update work');
		console.log(updateWork);

		if (work.estado != newWork.estado) {
			const wsu = await Work_State.findOne({ work: workId }).limit(1);
			wsu.state.push({ nombre: updateWork.estado.name, fecha: Date() });
			await Work_State.findByIdAndUpdate(wsu._id, wsu, {
				new: true,
			});
		}

		res.status(201).json({
			ok: true,
			updateWork,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: 'habla con el administrador ',
		});
	}
};

const deleteWork = async (req, res = response) => {
	// get the id form the url
	const workId = req.params.id;
	try {
		//get the work by id
		const work = await Work.findById(workId);
		// console.log(work);
		if (!work) {
			return res.status(404).json({
				ok: false,
				msg: 'no se encontró trabajo con ese id..',
			});
		}

		//fiund all the work_state before delete

		const workState = await Work_State.find({ work: workId });
		if (workState) {
			await Work_State.deleteOne({ work: workId });
		}

		// return res.json({
		// 	ok: true,
		// 	workState,
		// });

		// return res.status(201).json({
		// 	ok: 'Hilaire',
		// 	work,
		// 	workState,
		// });
		// const newWork = { ...req.body };

		await Work.findByIdAndDelete(workId);

		res.status(201).json({
			ok: true,
			msg: 'Trabajo eliminado correctamente...',
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: 'habla con el administrador ',
		});
	}
};

const deleteAll = async (req, res = response) => {
	try {
		const del = await Work.deleteMany();

		return res.status(201).json({
			ok: true,
			msg: 'Trabajos borrados con existos...',
		});
	} catch (error) {
		return res.status(500).json({
			ok: false,
			msg: 'habla con el administrador ',
		});
	}
};

const loadFile = (req, res = response) => {
	if (req.files === null || req.files === undefined) {
		return res.json({
			ok: false,
			msg: 'hubo un problema al subir la imagen',
			files: req.files,
		});
	}
	const imagenes = req.files.files;
	console.log(imagenes.length, typeof imagenes);
	if (imagenes.length >= 2) {
		for (let index = 0; index < imagenes.length; index++) {
			imagenes[index].name =
				new Date().getTime() +
				Math.floor(Math.random() * (1000 - 9999) + 9999) +
				imagenes[index].name;
		}
		const imagenFormat = [];
		const url =
			'C:/Users/JHMesseroux/Desktop/NicoProject/taller-nico/public/assets/img/works/';

		if (!fs.existsSync(url)) {
			// console.log(" no existe...");
			fs.mkdirSync(url, 0744);
		}

		for (let index = 0; index < imagenes.length; index++) {
			let img = {
				fileName: imagenes[index].name,
				filePath: `${url}${imagenes[index].name}`,
				fileSize: imagenes[index].size,
				fileMineType: imagenes[index].mineyype,
			};

			imagenes[index].mv(`${url}${imagenes[index].name}`, (err) => {
				if (err) {
					console.log(err);
					return res.status(400).json({
						err,
						msg: 'No se pudo subir la imagen',
					});
				}
			});

			imagenFormat.push(img);
		}
		return res.json({
			ok: true,
			msg: 'imagenes subidos con existos',
			imagenFormat,
		});
	} else {
		return res.json({
			ok: true,
		});
	}
};

const uploadImagenWork = async (req, res = response) => {
	try {
		// console.log(req.body);
		const r = [];
		for (let index = 0; index < req.body.length; index++) {
			const resp = await cloudinary.uploader.upload(
				req.body[index],
				{
					upload_preset: 'NovaTech',
				},
				function (error, result) {
					if (error) {
						return res.status(500).json({
							ok: false,
							msg: 'Error al guardar la imagen!',
						});
					}
					console.log(result);

					let partial = {
						public_id: result.public_id,
						format: result.format,
						size: result.bytes,
						url: result.url,
					};
					r.push(partial);
				}
			);
		}

		res.status(201).json({
			ok: true,
			pathImg: r,
		});
	} catch (error) {}
};

const getWorksByDataAndTurnedinState = async (req, res) => {
	try {
		const works = await Work.find({
			estado: '608d831076b79112c456a50b',
		})
			.populate('cliente estado')
			.sort('fechaInicio');
		console.log(works);
		return res.json({
			ok: true,
			works,
		});
	} catch (error) {
		return res.status(500).json({
			ok: false,
			msg: 'habla con el administrador....',
		});
	}
};

module.exports = {
	getAllWorks,
	createWork,
	deleteWork,
	updateWork,
	getOneWork,
	getWorksClient,
	deleteAll,
	loadFile,
	getWorksByDataAndTurnedinState,
	uploadImagenWork,
};
