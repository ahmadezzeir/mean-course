
const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req,res,next) => {
  console.log('start',req.body);
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    console.log(user);
    user.save()
    .then(result => {
      res.status(201).json({
        message: "user created",
        result: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "user not created",
        result: err
      });
    })
  });

});


router.post("/login", (req,res,next) => {
  let fetchUser;
  User.findOne({email: req.body.email})
    .then(user => {
      if(!user) {
        return res.status(404).json({
          message: "User not exists",
        });
      }
      fetchUser = user;
      console.log(fetchUser);
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(passwordMatch => {
      if(!passwordMatch) {
        return res.status(404).json({
          message: "Password is wrong"
        });
      }
      const token = jwt.sign(
        {email: fetchUser.email, userID: fetchUser._id},
        "114e0588-fc5f-4a72-86b7-de12b7cc1611-9815641d-606c-4198-b2cc-3ae24953851f",
        {expiresIn: '1h'}
      );
      return res.status(200).json({
        message: "login successfully",
        token: token,
        // user: fetchUser
      });
    })
    .catch(err => {
      console.log(err);
    });
});
module.exports = router;
