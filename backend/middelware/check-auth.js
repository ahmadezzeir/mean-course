const jwt = require('jsonwebtoken');
const config = require("../config");

module.exports = (req,res,next) => {
  try{
    // console.log('check-auth-authorization',req.headers);
    const token = req.headers.authorization.split(' ')[1];

    const decodedToken = jwt.verify(
        token,
        //"114e0588-fc5f-4a72-86b7-de12b7cc1611-9815641d-606c-4198-b2cc-3ae24953851f"
        config.jwt_key
      );
    req.userData = {email: decodedToken.email, userID: decodedToken.userID};

    next();
  } catch(error) {
     res.status(401).json({
       message: "you are not authenticated"
     });
  }
}
