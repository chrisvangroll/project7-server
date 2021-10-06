const passwordSchema = require('../constraints/password')

module.exports = (req, res, next) =>{
    if(!passwordSchema.validate(req.body.password)){
        console.log('password is invalid');
        res.status(400).json({error: 'password is invalid'});
    }else{
        next();
    }
} 