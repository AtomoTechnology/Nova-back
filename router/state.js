const express = require("express");
const State = require("../models/State");

const router = express.Router();

router.post("/", async (req, res) => {
  const body = req.body;
  try {
    const state = new State(body);
    const result = await state.save();
    return res.status(201).json({
      ok: true,
      msg: "estado creado con exito...",
      result,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      ok: false,
      msg: "hable con el admin...",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const states = await State.find();
    return res.status(201).json({
      ok: true,
      states,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      ok: false,
      msg: "hable con el admin...",
    });
  }
});

router.delete("/", async (req, res) => {
  try {
    await State.deleteMany();
    return res.status(201).json({
      ok: true,
      msg: "Estado borrados con exitos",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      ok: false,
      msg: "hable con el admin...",
    });
  }
});

module.exports = router;
