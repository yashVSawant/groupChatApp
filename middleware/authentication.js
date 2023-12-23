const jwt = require('jsonwebtoken');
const User = require('../model/user');
require('dotenv').config();

const authenticate = async(req,res,next)=>{

    try{
        const token = req.header('Authorization')
        // console.log("get>>>>",token)
        const user = jwt.verify(token,process.env.TOKEN);
        // console.log('token >>>',user);
        const getUser = await User.findByPk(user.userId);
        req.user = getUser;
        next();
    }catch(err){
        res.status(401).json({success:false,message:'something went wrong in authentication'});
    }
}

module.exports = {authenticate};