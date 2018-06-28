//libraries
const path = require("path"); // handels paths on all OS systems
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//Routes
const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");
const uploadsRoutes = require("./routes/uploads");
const config = require("./config");



const app = express();
//console.log(config.db_password);
mongoose
  .connect(    
    "mongodb://aezzeir:"+config.db_password+"@cluster0-shard-00-00-azswa.mongodb.net:27017,cluster0-shard-00-01-azswa.mongodb.net:27017,cluster0-shard-00-02-azswa.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin"
  )
  .then(() => {
    console.log("db connected succesfullt");
  })
  .catch((err) => {
    console.log("db connected failed",err);
    res.status(500).json({
      message: "unable to connect to the database"
    });
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
<<<<<<< HEAD
app.use("/images", express.static(path.join("images"))); // alow access to image folder
=======
//app.use("/images", express.static(path.join("/images")));
app.use("/uploads", express.static(path.join("./uploads"))); // alow access to image folder
app.use(express.static(path.join(__dirname, 'uploads')));
>>>>>>> 11-upload-multi-files

app.use((req, res, next) => {
  //res.setHeader('Access-Control-Allow-Origin','http://localhost:4200');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin , Content-Type, X-Requested-With ,Accept,authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/uploads", uploadsRoutes);

module.exports = app;
