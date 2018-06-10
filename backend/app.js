const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Header','Origin',
    'Origin',
    'Content-Type',
    'Accept');
    res.setHeader('GET','POST','PATCH','DELETE','OPTIONS');
    next();
});


app.use('/api/posts',(req,res, next) => {
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
