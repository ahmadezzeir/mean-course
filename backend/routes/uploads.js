const express = require('express');
var multer = require('multer');


var storage = multer.diskStorage({
  // destination
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });


const router = express.Router();
router.post("/uploads", upload.array("uploads[]", 12), function (req, res) {
  console.log('files', req.files);
  res.send(req.files);
});

router.get("", function (req, res) {
  //console.log('files', req.files);
  res.status(200).json({
    message:'hi'
  });
  res.send(req.files);
});

module.exports = router;
