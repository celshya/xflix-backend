const router = require("express").Router();
const httpStatus = require("http-status");
const { videoController } = require("../../controllers");
// request to get videos with different parameters
// get all videos
router.get("/", videoController.getVideos);

// get video with videoID
router.get("/:videoId", videoController.getVideo);

// request to create video data in database
router.post("/", videoController.createVideo);

// request to update video votes 
router.patch("/:videoId/votes", videoController.updateVideoVote);

// request to update video views 
router.patch("/:videoId/views", videoController.updateVideoViews);

module.exports = router;