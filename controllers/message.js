const message = require('../models/message');
const user = require('../models/user');
const Sequelize = require('sequelize')


exports.getMessages = async(req,res,next)=>{
    try{
        const lastMsgId = +req.query.lastMsgId;
        const groupId = +req.query.groupId;

            const groupChats = await message.findAll({
                where:{id:{
                            [Sequelize.Op.gt]:lastMsgId
                        },
                        GroupId:groupId
                    },
                include: [
                        {
                          model: user, // Assuming you have a User model
                          attributes: ['name'] // Specify the attributes you want to retrieve
                        }]
               
              })
    // console.log(groupChats);
        if(groupChats.length!==0){  
            res.status(200).json({success:true,groupChats});
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
        const {text,groupId} = req.body;
        const Msg = await message.create({text,GroupId:groupId,UserId:req.user.id});
        res.status(201).json({Msg})
    }catch(err){
        // console.log(err)
        res.status(400).json({success:false,error:err})
    }
}

