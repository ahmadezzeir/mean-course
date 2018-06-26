const multer = require("multer");
const MIME_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpeg': 'jpg',
  'image.jpg' : 'jpg'
}
const multerStorage = multer.diskStorage({
  destination: (req,file,cb) => {
    //server side validation
    //console.log(file);
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

module.exports = multer({storage:multerStorage}).single('image');
