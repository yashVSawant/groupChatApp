const message = require('../models/message');

exports.getMessage = (req,res,next)=>{
    
}

exports.postMessage = async(req,res,next)=>{
    try{
        const {text} = req.body;
        const Msg = await message.create({text,UserEmail:req.user.email})
        res.status(201).json({Msg})
    }catch(err){
        // console.log(err)
        res.status(400).json({success:false,error:err})
    }
}