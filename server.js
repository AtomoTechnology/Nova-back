const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

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

app.listen(process.env.PORT, () => {
  console.log(`server : ${process.env.PORT}`);
});

module.exports = app;
