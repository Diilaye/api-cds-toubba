const jwt = require("jsonwebtoken");


require('dotenv').config({
    path:'./.env'
});

module.exports = async (req, res, next) => {
  //get the token from the header if present
  let token = req.headers["x-access-token"] || req.headers["authorization"] || '';
  //if no token found, return response (without going to the next middelware)
  token = token.replace('Bearer ', '');


  if (!token) return res.json({
    message: 'No Token',
    statusCode: 400,
    data: null,

    status: 'NOT OK'
  });

 
  


  try {
      
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log(decoded);

    req.user = decoded;
    
    req.token = token;

    next();
  
    } catch (ex) {
      console.log(ex);
    res.json({
      message: 'unauthorized authentication required',
      statusCode: 401,
      data: ex,
      status: 'NOT OK'
    });
  }
};