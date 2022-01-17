const { Schema, model } = require('mongoose');
const Work_StateSchema = Schema({
  createAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  work: {
    type: Schema.Types.ObjectId,
    ref: 'Work',
    required: [true, 'Necesita especificar un trabajo para esta accion'],
  },
  state: [
    {
      nombre: String,
      fecha: Date,
    },
  ],
});

module.exports = model('Work_State', Work_StateSchema);
