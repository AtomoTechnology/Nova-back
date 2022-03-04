const express = require('express');
const bodyParser = require('body-parser');
// const fileUpload = require('express-fileupload');
const app = require('./server');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const path = require('path');
const HandleGlobalError = require('./controllers/errorController');
// const multer = require('multer');

//import fileUpload

// enable the cors

app.use(cors());
app.use(express.static(path.join(__dirname, '/public/build')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

app.use(bodyParser.json({ limit: '220mb' }));
app.use(bodyParser.urlencoded({ limit: '220mb', extended: true }));
//create the public folder
// console.log(path.join(__dirname, '/public'));

//receive datas form the body
app.use(express.json());
// app.use(fileUpload());

app.use(xss());
app.use(hpp());
app.use(helmet());
app.use(mongoSanitize());
//other way to set the public folder
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// const upload = multer({ dest: "uploads/" });

// app.post("/upload", upload.single("img"), function (req, res, next) {
//   console.log("file" + req.file);
//   res.send("Successfully uploaded!");
// });

console.log(process.env.NODE_ENV);

// console.log('uiui');
// module.exports = { upload };
// create routers
app.use('/api/v1/state', require('./router/stateRoute'));
app.use('/api/v1/outgoings', require('./router/outGoingsRoute'));
app.use('/api/v1/users', require('./router/userRoute'));
app.use('/api/v1/works', require('./router/workRoute'));
app.use('/api/v1/queries', require('./router/queryRoute'));
app.use('/api/v1/banners', require('./router/bannerRoute'));
// app.use('/api/v1/orders', require('./router/orders'));
// app.use('/api/v1/work_state', require('./router/work_State'));
// app.use('/api/v1/auth', require('./router/auth'));
// app.use('/api/clients', require('./router/clients'));

//any other url incorrect
app.use('*', (req, res, next) => {
  res.status(500).json({
    ok: false,
    msg: `this url : ${req.originalUrl} does not exist`,
  });
  next();
});

app.use(HandleGlobalError);

// hear the petition
