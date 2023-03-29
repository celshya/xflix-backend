const { Video } = require("../models");
const Values = require("../utils/values")
const { ObjectId } = require('mongodb');
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const getVideos = async (title,contentRating,genres,sortBy) => {
    const titleMatch = {title:{$regex:title,$options:"i"}};

    const contentRatings=getPossibleContentRatings(contentRating);
    const contentRatingMatch ={contentRating:{$in:contentRatings}};
    console.log(genres)
    let genreMatch = {genre:{$in:genres}}
    if(genres.includes("All")){
      genreMatch=null;
    }

   
    const videos=await Video.find({...titleMatch,...contentRatingMatch,...genreMatch}).sort({
      releaseDate:1,viewCount:1
    })
    return videos;
  };


const getPossibleContentRatings=(contentRating)=>{
  contentRating = decodeURIComponent(contentRating);
  let contentRatings =  [...Values.contentRatings];
  if(contentRating==="All"){
    return contentRatings;
  }

  const contentRatingIndex=contentRatings.indexOf(contentRating);
  const possiblecontentratings = contentRatings.splice(0,contentRatingIndex+1);
  return possiblecontentratings;
}

  const getVideosByTitle=async(title)=>{
    const videos = await Video.find({ title: { $regex: title, $options: 'i' } });
    return videos;
  }
  
  const getVideosByGenre=async(genres)=>{
    let query = {};
    if (genres === "All") {
        return await Video.find({});
    } 
    else {
    query = { genre: { $in: genres.split(",") } };
    }
 
  return await Video.find(query);
  }

  const getVideosByContentRating=async(contentRating)=>{

    contentRating = decodeURIComponent(contentRating);
  
    let query = {};
    let ratings = ["Anyone", "7+", "12+", "16+", "18+"];
    let index = ratings.indexOf(contentRating);
    if (index !== -1) {
      let ratingsToMatch = ratings.slice(0, index + 1);
      query = { contentRating: { $in: ratingsToMatch } };
  
    } else {
      query = { contentRating };
    }
    return await Video.find(query);
  }


  const getVideoById=async(videoId)=>{
    const video = await Video.findOne({ _id: ObjectId(videoId) });
  
    return video;
  }

  const createVideo=async(videoBody)=>{
    const video = await Video.create(videoBody);
    return video;
  }
  const updateVote=async(videoId, vote, change)=>{

    if (!Values.updateVoteTypes.includes(vote)) {
      throw new Error(`Invalid vote: ${vote}`);
    }
  
    if (!Values.changeVoteTypes.includes(change)) {
      throw new Error(`Invalid change: ${change}`);
    }
  
    const update = { $inc: {} };
    update.$inc[vote] = change === 'increase' ? 1 : -1;
  
    await Video.findByIdAndUpdate(videoId, update);

  }
  const changeViewCount=async(videoId)=>{
    const video = await Video.findById(videoId);
    if (video) {
      video.viewCount++;
      await video.save();
    }
   return video;
  }
  module.exports = {
    getVideos,getVideoById,createVideo,updateVote,changeViewCount
  };