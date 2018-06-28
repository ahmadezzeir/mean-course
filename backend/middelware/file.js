const multer = require("multer");
const MIME_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpeg': 'jpg',
  'image.jpg' : 'jpg'
}
const multerStorage = multer.diskStorage({
  destination: (req,file,cb) => {
    //server side validation
<<<<<<< HEAD
    const isValied = MIME_TYPE_MAP[file.mimetype];
    let error  = new Error('Invalid mime type');
    if(isValied) {
      error = null;
    }
    cb(error,"images");
=======
    //console.log('req',req.body.);
    

     const isValied = MIME_TYPE_MAP[file.mimetype];
     let error  = new Error('Invalid mime type');
     if(isValied) {
       error = null;
     }

    cb(error,"./uploads");
>>>>>>> 11-upload-multi-files
  },
  filename: (req,file,cb) => {
    //console.log('files1',file);
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }

});

module.exports = multer({storage:multerStorage}).single('image');
