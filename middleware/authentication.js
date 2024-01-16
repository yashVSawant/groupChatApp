const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const authenticate = async(req,res,next)=>{

    try{
        const token = req.header('Authorization')
        const user = jwt.verify(token,process.env.TOKEN);
        const getUser = await User.findByPk(user.id);
        req.user = getUser;
        if(req.user==null)throw new Error('invalid user!')
        next();
    }catch(err){
        // console.log('error from authenticate')
        res.status(401).json({success:false,message:'unauthorize user authentication'});
    }
}

module.exports = {authenticate};