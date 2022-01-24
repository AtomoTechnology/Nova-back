const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = require('./server');
const cors = require('cors');

// const multer = require('multer');

//import fileUpload

// enable the cors
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//create the public folder
app.use(express.static('public'));

//receive datas form the body
app.use(express.json());
app.use(fileUpload());

//other way to set the public folder
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// const upload = multer({ dest: "uploads/" });

// app.post("/upload", upload.single("img"), function (req, res, next) {
//   console.log("file" + req.file);
//   res.send("Successfully uploaded!");
// });

// console.log('uiui');
// module.exports = { upload };
// create routers
app.use('/api/v1/state', require('./router/stateRoute'));
app.use('/api/v1/outgoings', require('./router/outGoingsRoute'));
app.use('/api/v1/users', require('./router/userRoute'));
app.use('/api/v1/works', require('./router/workRoute'));
app.use('/api/v1/queries', require('./router/queryRoute'));
// app.use('/api/v1/orders', require('./router/orders'));
// app.use('/api/v1/work_state', require('./router/work_State'));
// app.use('/api/v1/auth', require('./router/auth'));
// app.use('/api/clients', require('./router/clients'));

//any other url incorrect
app.use('*', (req, res, next) => {
  res.status(500).json({
    ok: false,
    msg: 'URL Incorrecto...',
  });
  next();
});

app.use((err, req, res, next) => {
  return res.status(400).json({
    status: err.status,
    message: err.message,
    err,
  });
});

// hear the petition
