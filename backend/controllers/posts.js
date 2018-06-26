
const Post = require("../models/post");

exports.getList = (req, res, next) => {
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
    //console.log('count',count);
    //console.log('backend-route-post:fetchPosts',fetchPosts);
    res.status(200).json({
      message: "fetch from service",
      posts: fetchPosts,
      count: count
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "unable to fetch posts"
    });
  });
}

exports.getDetails = (req, res, next) => {

  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json({message: 'post updated successfully',post:post});
      //console.log(post);
    } else {
      res.status(404).json({message: 'post not found',post:null});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "unable to fetch post"
    });
  });
}




exports.insert = (req, res, next) => {
  // console.log('start')
  const url = req.protocol + "://" + req.get("host");
  // console.log(url);
  // console.log(url + "/images/" + req.file.filename);
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    createdBy: req.userData.userID,
    created: new Date(),
  });
  console.log(post);
  // console.log('*****************');
  // console.log(post);
  // console.log('*****************');
  post.save()
    .then(createdPost => {
      // console.log(createdPost);
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
    })
    .catch(error => {
      res.status(500).json({
        message: "post not created"
      });
    });
}

exports.update = (req, res, next) => {

  // console.log('incoming request',req.file);
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
    imagePath: imagePath,
    updatedBy: req.userData.userID,
    updated: new Date(),
  });
  Post.updateOne({ _id: req.params.id, createdBy: req.userData.userID }, post)
    .then(result => {
      console.log(result);
      if(result.n > 0) {
         console.log('200');
        res.status(200).json({ message: "post updated" });
      } else {
         console.log('401');
        res.status(401).json({ message: "post not found" });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "post not updated"
      });
      console.log("**************Update-Error-Start***************");
      console.log(err);
      console.log("**************Update-Error-End***************");
    });
}

exports.delete = (req, res, next) => {
  // console.log("***********Delete****************");
  // console.log("pased id: ", req.params.id);
  Post.deleteOne({ _id: req.params.id, createdBy: req.userData.userID })
    .then(result => {
      if(result.n > 0) {
        res.status(200).json({ message: "post deleted successfully " });
      } else {
        res.status(401).json({ message: "post not found" });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "post not deleted"
      });
      console.log("**************Error-Start***************");
      console.log(err);
      console.log("**************Error-End***************");
    });
}
