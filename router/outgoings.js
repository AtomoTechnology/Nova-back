const express = require('express');
const Outgoing = require('../models/Outgoing');

const router = express.Router();

router.post('/', async (req, res) => {
	const body = req.body;
	try {
		const outgoing = new Outgoing(body);
		const gasto = await outgoing.save();
		return res.status(201).json({
			ok: true,
			msg: 'Gasto agregado con exito...',
			gasto,
		});
	} catch (error) {
		console.log(error);
		return res.json({
			ok: false,
			msg: 'Error al agregar el gasto. Hable con el admin...',
		});
	}
});

router.get('/', async (req, res) => {
	try {
		const gastos = await Outgoing.find();
		return res.status(201).json({
			ok: true,
			gastos,
		});
	} catch (error) {
		console.log(error);
		return res.json({
			ok: false,
			msg: 'Error al agregar el gasto. Hable con el admin...',
		});
	}
});

router.delete('/', async (req, res) => {
	try {
		await Outgoing.deleteMany();
		return res.status(201).json({
			ok: true,
			msg: 'Gastos borrados con exitos',
		});
	} catch (error) {
		console.log(error);
		return res.json({
			ok: false,
			msg: 'Error al agregar el gasto. Hable con el admin...',
		});
	}
});

module.exports = router;
