const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { v4: uuidv4 } = require("uuid");
const { videoService } = require("../services");

/**
 *  returns videos according to given filter
 */
const getVideos = (async (req, res) => {
  
  let filterquery = {};

  const videos = await videoService.getAllVideos(req);
  console.log("Videos length - ",videos.length);
  
  if (!videos || videos.length === 0) {
    // console.log("videos - ", videos);
    throw new ApiError(httpStatus.NOT_FOUND, "Videos not found");
  }

  
  res.status(httpStatus.OK).json({videos: videos});
});

/**
 * returns video according to given video id
 */
const getVideo = (async (req, res) => {
  const video = await videoService.getVideoById(req.params.videoId);

  if (!video) {
    // throw new ApiError(httpStatus.NOT_FOUND, "Video not found");
    res.status(httpStatus.NO_CONTENT).send();
    
  }

  res.status(httpStatus.OK).json(video);
});
/**
 * create new video in videos collection and returned it
 */
const createVideo = (async (req, res) => {
  const newId = uuidv4();
  const data = { id: newId, ...req.body };
  const newVideo = await videoService.createNewVideo(req.body);

  console.log(newVideo);
  res.status(httpStatus.CREATED).json(newVideo);
});

/**
 * update video vote and return status 204
 */
const updateVideoVote = (async (req, res) => {
  const video = await videoService.updateVideoVote(
    req.params.videoId,
    req.body
  );
  console.log("controller change video", video);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * update video vote and return status 204 no_content if success
 *  On failure return status 400 BAD_REQUEST
 */
const updateVideoViews = (async (req, res) => {
  const video = await videoService.updateVideoViews(req.params.videoId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getVideos,
  getVideo,
  createVideo,
  updateVideoVote,
  updateVideoViews,
};
