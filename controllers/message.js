const message = require('../models/message');
const user = require('../models/user');
const Sequelize = require('sequelize')

exports.getMessages = async(req,res,next)=>{
    try{
        const lastMsgId = +req.query.lastMsgId;
        console.log(lastMsgId )
            const chats = await message.findAll({
                where:{id:{
                    [Sequelize.Op.gt]:lastMsgId
                }},
                attributes:['id','text','UserEmail'],
                include: [{ model: user, attributes: ['name'] }]
            })
            console.log(chats)
        if(chats.length!==0){    
            res.status(200).json({success:true,chats});
        }else{
            res.status(200).json({success:false});
        }
        
    }catch(err){
        console.log(err)
        res.status(404).json({success:false,err})
    }

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