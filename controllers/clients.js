const express = require("express");
const { response } = require("express");
const app = express();
const fs = require("fs");
const Client = require("../models/Clients");
const fileUpload = require("express-fileupload");
const { cloudinary } = require("../helpers/cloudinary");

app.use(fileUpload());
const createClient = async (req, res = response) => {
  // console.log(req.body);

  try {
    const client = new Client(req.body);
    console.log(client);
    // return 1;
    const clientExist = await Client.findOne({ dni: req.body.dni });

    if (clientExist) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un usuario con este dni...",
      });
    }
    client.save();
    return res.status(201).json({
      ok: true,
      msg: "Cliente agregado con existo!!!",
      client,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Habla con el administrador",
    });
  }
};

const getOneClient = async (req, res = response) => {
  const clientId = req.params.id;

  try {
    // console.log(clientId);
    const client = await Client.findById(clientId);
    return res.status(201).json({
      ok: true,
      client,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Habla con el administrador",
    });
  }
};

const getAllClient = async (req, res = response) => {
  try {
    const clients = await Client.find();
    if (!clients) {
      return res.status(400).json({
        ok: false,
        msg: "No hay clientes disponible...",
      });
    }

    return res.status(201).json({
      ok: true,
      clients,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Habla con el administrador",
    });
  }
};

const updateClient = async (req, res = response) => {
  const clientId = req.params.id;

  try {
    console.log(clientId);
    const clientOriginal = await Client.findById(clientId);
    if (!clientOriginal) {
      return res.status(500).json({
        ok: false,
        msg: "No existe un usuario con este id...",
      });
    }
    const clientModified = await Client.findByIdAndUpdate(clientId, req.body, {
      new: true,
    });
    return res.status(201).json({
      ok: true,
      clientModified,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Habla con el administrador",
    });
  }
};

// const loadFile = (req, res = response) => {
//   if (req.files === null || req.files == undefined) {
//     return res.json({
//       ok: false,
//       msg: "No hay archivo(s)",
//     });
//   }
//   const file = req.files.file;
//   file.name = new Date().getTime() + file.name;
//   console.log(process.cwd());
//   const url =
//     "http://localhost:4000/backendTaller/public/assets/img/client/";

//   if (!fs.existsSync(url)) {
//     // console.log(" no existe...");
//     fs.mkdirSync(url, 0744);
//   }

//   file.mv(`${url}${file.name}`, (err) => {
//     if (err) {
//       console.log(err);
//       return res.status(400).json({
//         err,
//       });
//     }

//     res.json({
//       ok: true,
//       fileName: file.name,
//       filePath: `${url}${file.name}`,
//       fileSize: file.size,
//       fileMineType: file.mineyype,
//     });
//   });
// };


const uploadImagenCliente = async (req, res = response) => {
  console.log('result');
  console.log(req.body);
  try {

    const resp = await cloudinary.uploader.upload(req.body.file,
      {
        upload_preset: 'NovaTech'
      },
      function (error, result) {
        if(error){
          return res.status(500).json({
            ok : false,
            msg : 'Error al guardar la imagen!'
          })
        }
        console.log(result);
        res.status(201).json({
          ok : true,
          public_id: result.public_id,
          format: result.format,
          size: result.bytes,
          url: result.url
        });
      });

  } catch (error) {

    console.log(error);
    res.status(500).json({ ok: false, msg: 'error al subir la imagen' })
  }
}

const deleteAll = async (req, res = response) => {
  try {
    const del = await Client.deleteMany();

    return res.status(201).json({
      ok: true,
      msg: "Clientes borrados con existos...",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "habla con el administrador ",
    });
  }
};
module.exports = {
  createClient,
  getOneClient,
  getAllClient,
  updateClient,
  // loadFile,
  deleteAll,
  uploadImagenCliente
};
