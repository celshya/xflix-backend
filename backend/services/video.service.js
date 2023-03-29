const config = require("../config/config");
const httpStatus = require("http-status");
const { Video } = require("../models");
const ApiError = require("../utils/ApiError");
const contentRatingArray = ["Anyone", "7+", "12+", "16+", "18+"];
// returns all videos
const getAllVideos = async (req) => {
  const filters = req.query;
  if (Object.keys(filters).length > 0) {
    const title = req.query.title ? req.query.title : "";
    const genres = req.query.genres ? req.query.genres : ["All"];
    const sortBy = req.query.sortBy ? req.query.sortBy : "releaseDate";
    const contentRating = req.query.contentRating
      ? req.query.contentRating
      : "All";
    const contentRatingArray = getAllContentRating(contentRating);

    const titleMatch = { title: { $regex: title, $options: "i" } };
    const contentRatingMatch = { contentRating: { $in: contentRatingArray } };
    let genreMatch = "";
    if (genres.length == 1 && genres[0] === "All") {
      genreMatch = { genre: { $regex: "", $options: "i" } };
    } else {
      if (genres.indexOf(",") != -1) {
        let test = genres.split(",");
        genreMatch = { genre: { $in: test } };
        console.log("test-", genreMatch);
      } else {
        genreMatch = { genre: genres };
      }
    }
    console.log("title - ", titleMatch);
    console.log("contentRating - ", contentRating);
    console.log("contentRatingMatch - ", contentRatingMatch);
    console.log("genres - ", genreMatch);
    console.log("sortBy - ", sortBy);

    if (sortBy === "releaseDate") {
      const filteredVideos = await Video.find({
        ...titleMatch,
        ...genreMatch,
        ...contentRatingMatch,
      });
      return filteredVideos.sort((a, b) => b.releaseDate - a.releaseDate);
    } else {
      return await Video.find({
        ...titleMatch,
        ...genreMatch,
        ...contentRatingMatch,
      }).sort({ sortBy: -1 });
    }
  } else {
    return await Video.find();
  }
};

const getAllContentRating = (contentRating) => {
  let index = contentRatingArray.indexOf(contentRating);
  if (index == -1) return contentRatingArray;
  else return contentRatingArray.slice(index, index + 1);
};

// return video data of given ID
const getVideoById = async (videoId) => {
  console.log("video id -- ", videoId);
  return await Video.findById(videoId);
};

// create new video data in returned it
const createNewVideo = async (videoBody) => {
  return await Video.create(videoBody);

  // return await Video.find({"_id": newVideo._id}).select(["_id","title","genre","videoLink","contentRating","releaseDate","previewImage"]);
};
// update video vote
const updateVideoVote = async (videoId, body) => {
  console.log("body - ", body);
  const video = await getVideoById(videoId);
  if (!video) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Video ID must be valid");
  }

  if (
    body.vote === config.video_upvote ||
    body.vote === config.video_downvote
  ) {
    if (body.vote === config.video_upvote) {
      if (body.change === config.video_vote_increase) {
        let updatedVAl = parseInt(video.votes.upVotes) + config.change_count;
        return await Video.findOneAndUpdate(
          { _id: videoId },
          { "votes.upVotes": updatedVAl },
          { new: true }
        );
      } else {
        let updatedVAl = parseInt(video.votes.upVotes) - config.change_count;
        return await Video.findOneAndUpdate(
          { _id: videoId },
          { "votes.upVotes": updatedVAl },
          { new: true }
        );
      }
    } else {
      if (body.change === config.video_vote_increase) {
        let updatedVAl = parseInt(video.votes.downVotes) + 1;
        return await Video.findOneAndUpdate(
          { _id: videoId },
          { "votes.downVotes": updatedVAl },
          { new: true }
        );
      } else {
        let updatedVAl = parseInt(video.votes.downVotes) - 1;
        return await Video.findOneAndUpdate(
          { _id: videoId },
          { "votes.downVotes": updatedVAl },
          { new: true }
        );
      }
    }
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "vote option must be valid");
  }

  // return await Video.findByIdAndUpdate(videoId, { $inc: { 'viewCount': 1 } });
};

// update Video views
const updateVideoViews = async (videoId) => {
  console.log("service id - ", videoId);
  const video = await getVideoById(videoId);
  console.log("service video - ", video);
  if (!video) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Video ID must be valid");
  }
  let updatedViewCount = parseInt(video.viewCount) + 1;
  return await Video.findByIdAndUpdate(videoId, {
    viewCount: updatedViewCount,
  });
};

module.exports = {
  getAllVideos,
  getVideoById,
  createNewVideo,
  updateVideoVote,
  updateVideoViews,
};
