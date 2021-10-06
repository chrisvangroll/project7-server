const jwt = require('jsonwebtoken');
require('dotenv/config');

module.exports = (req, res, next) => {
  try {
    console.log('123')
    //const token = req.headers.authorization.split(' ')[1];
    console.log(req.headers)
    
    const token = req.headers.authorization;
    console.log(token)
    
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    const userId = decodedToken.userId;
    //console.log('a' + req.body)
    
    if (req.body.userId && req.body.userId !== userId) {
      
      throw 'Invalid user ID';
    } else {
      
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};