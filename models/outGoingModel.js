const { Schema, model } = require('mongoose');
const OutgoingsSchema = Schema({
	description: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
		default: Date.now,
	},
	amount: {
		type: Number,
		required: true,
	},
});

module.exports = model('Outgoing', OutgoingsSchema);
