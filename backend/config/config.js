const PORT = 8082;
const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

const VIDEO_VOTE_INCREASE = "increase";
const VIDEO_VOTE_DECREASE = "decrease";
const VIDEO_UPVOTE = "upVote";
const VIDEO_DOWNVOTE = "downVote";
const CHANGE = "change";
const CHANGE_COUNT = 1;
 
 
// const DEFAULT_ADDRESSS = "ADDRESS_NOT_SET";

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    // JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);


module.exports = {
  port: PORT,
  video_upvote: VIDEO_UPVOTE,
  video_downvote: VIDEO_DOWNVOTE,
  video_vote_increase: VIDEO_VOTE_INCREASE,
  video_vote_decrease: VIDEO_VOTE_DECREASE,
  change: CHANGE,
  change_count : CHANGE_COUNT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === "test" ? "-test" : ""),
    options: {
      // useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
 
}