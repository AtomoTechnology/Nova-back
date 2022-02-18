const express = require('express');
const mongoose = require('mongoose');
const sequelize = require('./database/config');
require('dotenv').config();
const Banner = require('./models/banner');

const app = express();
mongoose
  .connect(process.env.dbConnect, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log('DB CONNECTED SUCCESSFULLY');
  });

// connect mysql

sequelize
  .authenticate()
  .then((value) => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

app.listen(process.env.PORT, () => {
  console.log(`server : ${process.env.PORT}`);
});

module.exports = app;
