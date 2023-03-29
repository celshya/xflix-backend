const express = require("express");
// const { route } = require("../../app");
const router = express.Router();

// All api request begiens with 'v1/videos' route to express router in video.route.js
const videoRoute = require("./video.route");
router.use("/videos", videoRoute);


module.exports = router;
