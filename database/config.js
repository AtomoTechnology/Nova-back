const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    mongoose.connect(process.env.dbConnect, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log("connection with exito...");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  dbConnection,
};
