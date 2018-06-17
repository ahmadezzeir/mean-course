
const express = require('express');
const Post = require("../models/post");
const router = express.Router();


router.post("", (req, res, next) => {
  console.log('start')
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post
    .save()
    .then(createdPost => {
      console.log(createdPost);
      res.status(201).json({
        message: "Post added successfully",
        newid: createdPost._id
      });
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json({message: 'updated successfully',post:post});
    } else {
      res.status(404).json({message: 'post not found',post:null});
    }
  });
});

router.get("", (req, res, next) => {
  Post.find().then(posts => {
    console.log(posts);
    res.status(200).json({
      message: "fetch from service",
      posts: posts
    });
  });
});

router.delete("/:id", (req, res, next) => {
  console.log("***********Delete****************");
  console.log("pased id: ", req.params.id);
  Post.deleteOne({ _id: req.params.id })
    .then(result => {
      res.status(200).json({ message: "post deleted" });
    })
    .catch(err => {
      console.log("**************Error-Start***************");
      console.log(err);
      console.log("**************Error-End***************");
    });
});

router.put("/:id", (req, res, next) => {
  console.log("***********EDIT****************");
  console.log("pased id: ", req.params.id);
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post)
    .then(result => {
      res.status(200).json({ message: "post updated" });
    })
    .catch(err => {
      console.log("**************Update-Error-Start***************");
      console.log(err);
      console.log("**************Update-Error-End***************");
    });
});

module.exports = router;
