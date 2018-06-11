const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Post = require("./models/post.");

const app = express();
mongoose
  .connect(
    "mongodb://aezzeir:7BrjJm8WfU4urxrm@cluster0-shard-00-00-azswa.mongodb.net:27017,cluster0-shard-00-01-azswa.mongodb.net:27017,cluster0-shard-00-02-azswa.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"
  )
  .then(() => {
    console.log("db connected succesfullt");
  })
  .catch(() => {
    console.log("db connected failed");
  });

app.use(bodyParser.json());
//app.use(bodyParser.urle);

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

app.post("/api/posts", (req, res, next) => {
  //console.log('add nerw post');
  // const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post
    .save()
    //console.log(post);
    .then(createdPost => {
      console.log(createdPost);
      res.status(201).json({
        message: "Post added successfully",
        newid: createdPost._id
      });
    });
});

app.get("/api/posts", (req, res, next) => {
  //res.send('hello from express');
  // const posts = [
  //   {
  //     id: "1",
  //     title: "title 1",
  //     content: "content 1"
  //   },
  //   {
  //     id: "2",
  //     title: "title 2",
  //     content: "content 3"
  //   }
  // ];
  Post.find().then(files => {
    console.log(files);
    res.status(200).json({
      message: "fetch from service",
      posts: files
    });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  console.log("***********Delete****************");
  console.log("pased id: ", req.params.id);
  Post.deleteOne({ _id: req.params.id })
    .then(result => {
      //console.log(result);
      res.status(200).json({ message: "post deleted" });
    })
    .catch(err => {
      console.log("**************Error-Start***************");
      console.log(err);
      console.log("**************Error-End***************");
    });
  //console.log(req.body.id);
});
module.exports = app;
