const express = require("express");
const videoController=require("../../controllers/video.controller")
const validate=require("../../middlewares/validate")
const videoValidation = require("../../validations/video.validation")
const router = express.Router();

router.get("/", validate(videoValidation.searchVideos),videoController.getVideos);

router.get("/:videoId", validate(videoValidation.getVideoById), videoController.getVideoById);

router.post('/', validate(videoValidation.createVideo), videoController.createVideo);

router.patch('/:videoId/votes', validate(videoValidation.updateVote), videoController.updateVote);
router.patch('/:videoId/views', validate(videoValidation.changeViewCount), videoController.changeViewCount);
module.exports = router;