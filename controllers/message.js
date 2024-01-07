const fs = require('fs')

const message = require('../models/message');
const user = require('../models/user');
const imageUrl = require('../models/imageUrl');
const Sequelize = require('sequelize')

const S3Services = require('../service/S3Services');


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
                          model: user, 
                          attributes: ['name','phoneNo'] 
                        }],
               attributes:['GroupId','text','imageUrl','id']
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

exports.postFile = async(req,res,next)=>{
    try{
        const {groupId} = req.body
    //    console.log(req.file,groupId)
        const getfile = req.file;
        const filename = `groupChat${groupId}/${new Date().getTime()}.jpg`;
        const fileUrl = await S3Services.uploadToS3(getfile,filename);
        // console.log(fileUrl);
        const getImageUrl = await message.create({imageUrl:fileUrl,GroupId:groupId,UserId:req.user.id});
        res.status(201).json({success:true})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false})
    }
   
}

exports.getFile = async(req,res,next)=>{
    try{
        
        res.status(200).json({success:true});
    }catch(err){
        res.status(500).json({success:false});
    }
}

