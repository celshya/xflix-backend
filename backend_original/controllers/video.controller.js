const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { videoService } = require("../services");
const { type } = require("os");

const getVideos = catchAsync(async (req, res) => {
    const title=req.query.title ? req.query.title:"";
    const contentRating = req.query.contentRating?req.query.contentRating:"All";
    const genres =req.query.genres?req.query.genres.split(","):["All"];
    const sortBy = req.query.sortBy?req.query.sortBy:"releaseDate"
    
    const videos = await videoService.getVideos(title,contentRating,genres,sortBy);
    res.status(200).send({videos:videos})
  });

  const getVideoById=catchAsync(async(req,res)=>{
   
    const video = await videoService.getVideoById(req.params.videoId);
    if (!video) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No video found with matching id');
    }
    res.status(200).json(video);
  })

  const createVideo=async(req, res)=>{
    const video = await videoService.createVideo(req.body);
    if(!video){
      throw new ApiError(httpStatus.BAD_REQUEST,"Invalid request")
    }
    res.status(httpStatus.CREATED).json(video);
  }

  const updateVote=async(req,res)=>{
    const { videoId } = req.params;
    const { vote, change } = req.body;

    const updatedVideo = await videoService.updateVote(videoId, vote, change);
    if (updatedVideo) {
      return res.status(204).end();
    } else {
      return res.status(404).json({
        code: 404,
        message: 'No video found with matching id',
      });
    }
    
  }

  const changeViewCount=async(req,res)=>{
    const { videoId } = req.params;
    let updatedvideo=await videoService.changeViewCount(videoId);
    if (updatedvideo) {
      return res.status(204).end();
    } else {
      return res.status(404).json({
        code: 404,
        message: 'No video found with matching id',
      });
    }
  }
    // if (title) {
    //   const titleVideos = await videoService.getVideosByTitle(title);
    //   videos.push(...titleVideos);
    //   console.log(typeof titleVideos[0]._id.toString())
    // }
    // if (genres) {
    //   const genreVideos = await videoService.getVideosByGenre(genres);
      
    //   if(videos.length===0){
    //     videos.push(...genreVideos)
    
    //   }
    //   else{
    //     console.log(videos.filter(obj1 =>
    //       genreVideos.some(obj2 => obj2._id.toString() === obj1._id.toString())
    //     ));
    //   }
      
   

    //   }
     
     
    
    // if (contentRating) {
    //   const ratingVideos = await videoService.getVideosByContentRating(contentRating);
    //   videos = videos.filter((video) => ratingVideos.includes(video));
    // }

    
    //   if (!title && !genres && !contentRating) {
    //     videos = await videoService.getVideos();
    //   }

  // res.send(videos);
   
 
  module.exports = {
    getVideos,getVideoById,createVideo,updateVote,changeViewCount
  };