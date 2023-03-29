const Joi = require("joi");
const Values = require("../utils/values")
const searchVideos={
    query:Joi.object().keys({
        title:Joi.string(),
        genres: Joi.string().regex(/^[\w,]+$/),
        contentRating:Joi.string().valid(...Values.contentRatings,"All"),
        sortBy:Joi.string().valid(...Values.sortBy)
    })
}

const getVideoById={
    params:Joi.object({
    videoId: Joi.string().length(24).required(),
  })
}

const createVideo = {
    body: Joi.object().keys({
      videoLink: Joi.string().required(),
      title: Joi.string().required(),
      genre: Joi.string().valid(...Values.genres).required(),
      contentRating: Joi.string().valid(...Values.contentRatings).required(),
      releaseDate: Joi.string().required(),
      previewImage: Joi.string().required(),
    }),
  };

  const updateVote={
    body: Joi.object().keys({
      vote: Joi.string().valid(...Values.updateVoteTypes).required(),
      change: Joi.string().valid(...Values.changeVoteTypes).required(),
    }),
  }

  const changeViewCount = {
    params: Joi.object().keys({
      videoId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message('"videoId" must be a valid MongoDB ObjectId'),
    }),
  };
module.exports={searchVideos,getVideoById,createVideo,updateVote,changeViewCount}