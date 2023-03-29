const mongoose = require("mongoose");
const config = require("./config/config");
const app = require("./app");
const port = 8082
let server;
// server = app.listen(port, ()=>{
//     console.log("Listing to port", config.port);
// });
// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Create Mongo connection and get the express app to listen on config.port
mongoose.connect(config.mongoose.url,config.mongoose.options)
.then(()=>{
    console.log("Connected to Mongodb");
    server = app.listen(config.port, () => {
        console.log("listing to port",config.port);
    })
})
.catch()
