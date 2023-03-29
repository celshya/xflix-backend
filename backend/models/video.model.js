const { boolean } = require("joi");
const mongoose = require("mongoose");

const videoSchema = mongoose.Schema(
    {
    videoLink: {
        type: String,
    },
    title: {
        type: String,
    },
    genre: {
        type: String,
    },
    contentRating: {
        type: String,
    }, 
    releaseDate: {
        type: Date,
    },
    previewImage: {
        type: String,
        },
    votes: {
        upVotes: { type: Number, default : 0},
        downVotes: { type: Number, default : 0}
    },
    viewCount: {
        type: Number,
        default : 0
    }

},
{ 
    versionKey: '__v' 
});

/**
 * @typedef Video
 */
const Video = mongoose.model("videos", videoSchema);

module.exports = {
    Video
};
