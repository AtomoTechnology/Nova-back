const express = require("express");
const Work_State = require("../models/Work_State");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = Work_State.find();

    uery = query.populate({
      path: "work",
      match: {
        // codigo: "v5o8z8",
        // precio: { $gte: 10000 },
      },
      //   select: "codigo precio",
      //   options: { limit: 5 },
      populate: {
        path: "cliente",
        //   match: {},
      },
    });

    // query = query.find({ work: null });

    const work_state = await query;
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
