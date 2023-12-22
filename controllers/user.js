const user = require('../models/user');

exports.getUsers = async(req,res,next)=>{
    
    try{
        const email = req.body.email;
        console.log(email)
        // const user = user.findByPk(email);
        res.status(201).json({success:true})
    }catch(err){
        console.log(err);
        res.status(404).json({success:false})
    }
}