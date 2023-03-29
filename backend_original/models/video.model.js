const mongoose = require("mongoose");
const validator =require("mongoose-unique-validator")
const Values = require("../utils/values")
const contentRatings= Values.contentRatings;
const genres = Values.genres;
const videoSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim:true
    },
    videoLink: {
      required:true,
      trim:true,
      unique:true,
        type: String,
        validate: {
          validator: (v) => {
            return /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})$/.test(v);
          },
          message: 'Video link must be in the format youtube.com/embed/<video-id>'
        }
      },
     
      genre: {
        type: String,
        required:true,
        trim:true,
        validate(value){
          if(!genres.includes(value)){
            throw new Error("Invalid genre")
          }
        }
        // enum: ["Education", "Sports", "Movies", "Comedy", "Lifestyle", "All"],
      },
      contentRating: {
        type: String,
        validate(value){
          if(!contentRatings.includes(value)){
            throw new Error("Invalid content rating")
          }
        }
        // enum: ["Anyone", "7+", "12+", "16+", "18+"],
      },
      releaseDate: {
        type:String,
        default: Date.now
      },
      previewImage: {
        type: String,
        required: true,
        default:"https://i.ibb.co/nbYsmJB/Xflix.jpg",
      },
  
      votes: {
        upVotes: {
          type: Number,
          default: 0
        },
        downVotes: {
          type: Number,
          default: 0
        }
      },
      viewCount:{
        type:Number,
        default:0
      }
      
   
  },
  {
    timestamps: false,
  }
);

const Video = mongoose.model("Video", videoSchema);

module.exports.Video = Video;
module.exports.videoSchema = videoSchema;