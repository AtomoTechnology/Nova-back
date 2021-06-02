const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    mongoose.connect(process.env.dbConnect, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("connection with exito...");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  dbConnection,
};
