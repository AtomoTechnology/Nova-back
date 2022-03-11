const express = require('express');
const bodyParser = require('body-parser');
const app = require('./server');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const path = require('path');
const HandleGlobalError = require('./controllers/errorController');

app.use(cors());
// app.use(express.static(path.join(__dirname, '/public/build')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

app.use(bodyParser.json({ limit: '220mb' }));
app.use(bodyParser.urlencoded({ limit: '220mb', extended: true }));
app.use(express.json());
app.use(xss());
app.use(hpp());
app.use(helmet());
app.use(mongoSanitize());

console.log(process.env.NODE_ENV);

app.use('/api/v1/state', require('./router/stateRoute'));
app.use('/api/v1/outgoings', require('./router/outGoingsRoute'));
app.use('/api/v1/users', require('./router/userRoute'));
app.use('/api/v1/works', require('./router/workRoute'));
app.use('/api/v1/queries', require('./router/queryRoute'));
app.use('/api/v1/banners', require('./router/bannerRoute'));

app.use('*', (req, res, next) => {
  res.status(500).json({
    ok: false,
    msg: `esta ruta : ${req.originalUrl} no existe`,
  });
  next();
});

app.use(HandleGlobalError);
