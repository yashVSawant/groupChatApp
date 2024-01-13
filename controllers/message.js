const fs = require('fs')

const message = require('../models/message');
const user = require('../models/user');
const Sequelize = require('sequelize')

const S3Services = require('../service/S3Services');
const userGroup = require('../models/userGroup');


exports.getMessages = async(req,res,next)=>{
    try{
        const lastMsgId = +req.query.lastMsgId;
        const groupId = +req.query.groupId;
        console.log(lastMsgId,groupId)
        if(lastMsgId&& groupId){
            const validateGroupUser = await userGroup.findOne({where:{userId:req.user.id,groupId:groupId}})
            if(validateGroupUser){
                const groupChats = await message.findAll({
                    where:{id:{
                                [Sequelize.Op.gt]:lastMsgId
                            },
                            groupId:groupId
                        },
                    include: [
                            {
                              model: user, 
                              attributes: ['name','phoneNo'] 
                            }],
                   attributes:['groupId','text','imageUrl','id']
                })
                if(groupChats.length!==0){  
                    res.status(200).json({success:true,groupChats});
                }else{
                    res.status(200).json({success:false});
                }
            }else{
                throw new Error();
            } 
        }else{
            throw new Error();
        } 
        
        
    }catch(err){
        console.log(err)
        res.status(404).json({success:false,err})
    }

}

exports.postMessage = async(req,res,next)=>{
    try{
        const {text,groupId} = req.body;
        const Msg = await message.create({text,groupId:groupId,userId:req.user.id});
        res.status(201).json({Msg})
    }catch(err){
        // console.log(err)
        res.status(400).json({success:false,error:err})
    }
}

exports.postFile = async(req,res,next)=>{
    try{
        const {groupId,text} = req.body
    //    console.log(req.file,groupId)
        const getfile = req.file;
        const filename = `groupChat${groupId}/${new Date().getTime()}.jpg`;
        const fileUrl = await S3Services.uploadToS3(getfile,filename);
        // console.log(fileUrl);
        await message.create({text:text,imageUrl:fileUrl,groupId:groupId,userId:req.user.id});
        res.status(201).json({success:true})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false})
    }
   
}

