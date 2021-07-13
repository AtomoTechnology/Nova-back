const express = require("express");

const fileUpload = require("express-fileupload");
const { dbConnection } = require("./database/config");

require("dotenv").config();
const cors = require("cors");

//create the server express
const app = express();

//import fileUpload

//connection to the database
dbConnection();

// enable the cors
app.use(cors());

//create the public folder
app.use(express.static("public"));

//receive datas form the body
app.use(express.json());
app.use(fileUpload());

app.post("/uploadFile", (req, res) => {
  console.log("from index pettion");
  if (req.files) {
    res.json({
      files: req.files,
    });
  } else {
    res.json({
      files: [],
    });
  }
});

// create routers
app.use("/api/state", require("./router/state"));
app.use("/api/auth", require("./router/auth"));
app.use("/api/works", require("./router/works"));
app.use("/api/clients", require("./router/clients"));
app.use("/api/orders", require("./router/orders"));
app.use("/api/work_state", require("./router/work_State"));

// hear the petition
app.listen(process.env.PORT, () => {
  console.log(`server : ${process.env.PORT}`);
});
