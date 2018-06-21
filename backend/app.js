const path = require("path"); // handels paths on all OS systems
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts");




const app = express();
mongoose
  .connect(
    "mongodb://aezzeir:7BrjJm8WfU4urxrm@cluster0-shard-00-00-azswa.mongodb.net:27017,cluster0-shard-00-01-azswa.mongodb.net:27017,cluster0-shard-00-02-azswa.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"
  )
  .then(() => {
    console.log("db connected succesfullt");
  })
  .catch((err) => {
    console.log("db connected failed",err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images"))); // alow access to image folder

app.use((req, res, next) => {
  //res.setHeader('Access-Control-Allow-Origin','http://localhost:4200');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin , Content-Type, X-Requested-With ,Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;
