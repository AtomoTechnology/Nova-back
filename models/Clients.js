const { Schema, model } = require("mongoose");
const ClientSchema = Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  dni: {
    type: String,
    required: true,
  },
  phone1: {
    type: String,
    required: true,
  },
  phone2: {
    type: String,
  },
  direction: {
    type: String,
  },
  nota: {
    type: String,
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  pathImg: {
    type: String,
    default: "",
  },
});

module.exports = model("Client", ClientSchema);
