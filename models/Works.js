const { Schema, model, SchemaType } = require('mongoose');
const WorkSchema = Schema({
	codigo: {
		type: String,
		required: true,
	},
	marca: {
		type: String,
		required: true,
	},
	modelo: {
		type: String,
		required: true,
	},
	emei: {
		type: String,
	},
	fachasEncontradas: {
		type: String,
	},
	observaciones: {
		type: String,
		required: true,
	},
	descripcion: {
		type: String,
	},
	estado: {
		type: Schema.Types.ObjectId,
		ref: 'State',
		required: true,
	},
	recargo: {
		type: Number,
		default: 0,
	},

	precio: {
		type: Number,
	},
	total: {
		type: Number,
	},
	descuento: {
		type: Number,
		default: 0,
	},
	fechaInicio: {
		type: Date,
		required: true,
	},
	cliente: {
		type: Schema.Types.ObjectId,
		ref: 'Client',
		required: true,
	},
	fechaFin: {
		type: Date,
	},
	images: [],
	contrasena: {
		type: String,
	},
	patron: {
		type: String,
	},
	esPatron: {
		type: Boolean,
	},
	tieneContrasena: {
		type: Boolean,
	},
});

module.exports = model('Work', WorkSchema);
