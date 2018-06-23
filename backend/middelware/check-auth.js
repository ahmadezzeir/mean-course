const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
  try{
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(
        token,
        "114e0588-fc5f-4a72-86b7-de12b7cc1611-9815641d-606c-4198-b2cc-3ae24953851f"
      );
      next();
  } catch(error) {
     res.status(401).json({
       message: "Invalid Token"
     });
  }
}
