const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const authenticate = async(req,res,next)=>{

    try{
        const token = req.header('Authorization')
        // console.log("get>>>>",token)
        const user = jwt.verify(token,process.env.TOKEN);
        // console.log('token >>>',user);
        const getUser = await User.findByPk(user.id);
        req.user = getUser;
        // console.log(req.user);
        if(req.user==null)throw new Error('invalid user!')
        next();
    }catch(err){
        console.log('error from authenticate')
        res.status(401).json({success:false,message:'something went wrong in authentication'});
    }
}

module.exports = {authenticate};