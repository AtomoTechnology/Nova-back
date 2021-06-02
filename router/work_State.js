const express = require("express");
const Work_State = require("../models/Work_State");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const work_state = await Work_State.find().populate({
      path: "work",
      populate: {
        path: "cliente",
      },
    });
    if (!work_state) {
      return res.status(500).json({
        ok: false,
        msg: "No hay resultado!!",
      });
    }
    return res.status(201).json({
      ok: true,
      work_state,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      ok: false,
      msg: "hable con el admin...",
    });
  }
});

router.get("/getStates/:workId", async (req, res) => {
  try {
    const workId = req.params.workId;
    const workState = await Work_State.findOne({ work: workId }).limit(1);
    console.log(workState);
    return res.status(201).json({
      ok: true,
      workState,
    });
  } catch (error) {
    return res.json({
      ok: false,
      msg: "hable con el admin...",
    });
  }
});

router.delete("/", async (req, res) => {
  try {
    await Work_State.deleteMany();
    return res.status(201).json({
      ok: true,
      msg: "Work state borrados con exitos ...",
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
