
const express = require('express');
const Post = require("../models/post");
const checkAuth = require('../middelware/check-auth');
const multer = require("multer");

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpeg': 'jpg',
  'image.jpg' : 'jpg'
}
const multerStorage = multer.diskStorage({
  destination: (req,file,cb) => {
    //server side validation
    const isValied = MIME_TYPE_MAP[file.mimetype];
    let error  = new Error('Invalid mime type');
    if(isValied) {
      error = null;
    }
    cb(error,"backend/images");
  },
  filename: (req,file,cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }

});

router.post("",checkAuth, multer({storage:multerStorage}).single('image'), (req, res, next) => {
  console.log('start')
  const url = req.protocol + "://" + req.get("host");
  console.log(url);
  console.log(url + "/images/" + req.file.filename);
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  console.log('*****************');
  console.log(post);
  console.log('*****************');
  post.save()
    .then(createdPost => {
      console.log(createdPost);
      res.status(201).json({
        message: "Post added successfully",
        // newid: createdPost._id
        post: {
          // id: createdPost._id,
          // title: createdPost.title,
          // content: createdPost.content,
          // imagePath: createdPost.imagePath
          ...createdPost,
          id: createdPost._id
        }
      });
    });
});

router.get("/:id",checkAuth, (req, res, next) => {

  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json({message: 'updated successfully',post:post});
      //console.log(post);
    } else {
      res.status(404).json({message: 'post not found',post:null});
    }
  });
});

router.get("", (req, res, next) => {
  console.log(req.query);
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const query = Post.find();
  let fetchPosts;
  if(pageSize && currentPage) {
    query.skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  query.then(posts => {
    fetchPosts = posts
    return Post.count();
  })

  // query.then(posts => {
  //   // console.log(posts);
  //   res.status(200).json({
  //     message: "fetch from service",
  //     posts: posts
  //   });
  // });

  .then(count => {
    console.log('count',count);
    res.status(200).json({
      message: "fetch from service",
      posts: fetchPosts,
      count: count
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

router.put("/:id",checkAuth,multer({storage:multerStorage}).single('image'), (req, res, next) => {

  console.log('incoming request',req.file);
  // console.log("***********EDIT****************");
  // console.log("pased id: ", req.params.id);
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }

  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
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
