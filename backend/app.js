const express = require('express');
const bodyParser = require('body-parser');

const Post = require('./models/post.');


const app = express();

app.use(bodyParser.json());
//app.use(bodyParser.urle);

app.use((req, res, next) => {
  //res.setHeader('Access-Control-Allow-Origin','http://localhost:4200');
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin , Content-Type, X-Requested-With ,Accept');
    res.setHeader('GET','POST','PATCH','DELETE','OPTIONS');
    next();
});

app.post('/api/posts', (req,res,next) => {
  //console.log('add nerw post');
  // const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.get('/api/posts',(req,res, next) => {
  //res.send('hello from express');
  const posts = [
    {
      id: '1',
      title:'title 1',
      content:'content 1'
    },
    {
      id: '2',
      title:'title 2',
      content:'content 3'
    },

  ];
  res.status(200).json({
      message:'fetch from service',
      posts: posts
  });
});

module.exports = app;
