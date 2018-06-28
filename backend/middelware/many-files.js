const express = require('express');
var multer = require('multer');

const MIME_TYPE_MAP_ALL = {
  'image/png' : 'png',
  'image/jpeg': 'jpg',
  'image.jpg' : 'jpg',
  'application/pdf': 'pdf',
  'image/tiff': '.tif',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx'
}

const MIME_TYPE_MAP_IMAGES = {
  'image/png' : 'png',
  'image/jpeg': 'jpg',
  'image.jpg' : 'jpg',
}


var multerStorage = multer.diskStorage({
  // destination
   
  destination: function (req, file, cb) {
    //console.log('%%%%%');
    console.log(file.fieldname);
    //console.log('%%%%%');
    


    if(file.fieldname == 'invoices') { 
      //console.log('invoice', file);
      const isValied = MIME_TYPE_MAP_ALL[file.mimetype];
      let error  = new Error('Invoices invalid mime type');
      if(isValied) {
        error = null;
      }

      cb(error, './uploads/invoices');
      //console.log('done for invoice');
    } else {
      const isValied = MIME_TYPE_MAP_IMAGES[file.mimetype];
      let error  = new Error('Images Invalid mime type');
      if(isValied) {
        error = null;
      }

      //console.log('images', file);
      cb(error, './uploads/images');
      //console.log('done for images');
    }
  },
  
  filename: function (req, file, cb) {
     //console.log('***************');
     //console.log(req);
     //console.log('***************');
    const prefex = (req.userData.userID + "-" + new Date().toDateString() + "-" + req.body.title ).split(' ').join('-');
    //const name =  prefex + "-" +file.originalname.toLowerCase().split(' ').join('-');
    const name = prefex + "-" + file.originalname.toLowerCase().split(' ').join('-');
    //const ext = MIME_TYPE_MAP_ALL[file.mimetype];
    //name = name + '-' + guid() + '.' + file.mimetype;   
    // console.log('newfile',name);
    //const ext = file.originalname.ext;
    //cb(null, name + '-' + guid() + '.' + file.mimetype);
    cb(null, name);
    //cb(null, name);
    //cb(null, name);
  }
});

// function guid() {
//   function _p8(s) {
//       var p = (Math.random().toString(16)+"000000000").substr(2,8);
//       return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
//   }
//   return _p8() + _p8(true) + _p8(true) + _p8();
// }

//var upload = multer({ storage: storage });
module.exports = multer(
  {storage:multerStorage}
).any();
//module.exports = multer({storage:multerStorage}).array('uplods');
