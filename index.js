const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('./database/config');
const multer = require('multer');

require('dotenv').config();
const cors = require('cors');

//create the server express
const app = express();

//import fileUpload

//connection to the database
dbConnection();

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

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('img'), function (req, res, next) {
	console.log('file' + req.file);
	res.send('Successfully uploaded!');
});

// console.log('uiui');
// module.exports = { upload };
// create routers
app.use('/api/state', require('./router/state'));
app.use('/api/outgoings', require('./router/outgoings'));
app.use('/api/auth', require('./router/auth'));
app.use('/api/works', require('./router/works'));
app.use('/api/clients', require('./router/clients'));
app.use('/api/orders', require('./router/orders'));
app.use('/api/work_state', require('./router/work_State'));

// hear the petition
app.listen(process.env.PORT, () => {
	console.log(`server : ${process.env.PORT}`);
});
