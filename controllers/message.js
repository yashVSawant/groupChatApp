const message = require('../models/message');
const user = require('../models/user');
const group = require('../models/group');
const userGroup = require('../models/userGroup');
const Sequelize = require('sequelize')

exports.getMessages = async(req,res,next)=>{
    try{
        const lastMsgId = +req.query.lastMsgId;
        const groupId = +req.query.groupId;

            const groupChats = await message.findAll({
                where:{id:{
                            [Sequelize.Op.gt]:lastMsgId
                        }},
                include:[
                    {
                        model:userGroup,
                        where:{GroupId:groupId}
                    }
                ]
              })
    
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
        const getUserGroup = await userGroup.findOne({where:{UserId:req.user.id,GroupId:groupId}})
        const Msg = await message.create({text,UserGroupId:getUserGroup.id,name:req.user.name});
        res.status(201).json({Msg})
    }catch(err){
        // console.log(err)
        res.status(400).json({success:false,error:err})
    }
}

exports.getGroups = async(req,res,next)=>{
    try{
        const getUserGroups = await group.findAll({include: [{
            model: user,
            through: userGroup,
            where: { id: req.user.id },
          }],});
        // console.log(getUserGroups);
        res.status(200).json({success:true,groups:getUserGroups});
    }catch(err){
        res.status(400).json({success:false});
    }
}