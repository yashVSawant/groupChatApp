const user = require('../models/user');
const group = require('../models/group');
const userGroup = require('../models/userGroup');
const joinRequest = require('../models/request');
const Sequelize = require('sequelize');


exports.createGroup = async(req,res,next)=>{
    try{
        const {name} = req.body;
        // console.log('name..>',name);
        const groupInstace =  await group.create({name,userId:req.user.id});
        const getNewGroup = await userGroup.create({groupId:groupInstace.id,userId:req.user.id,isAdmin:true});
        res.status(201).json({success:true,group:getNewGroup});
    }catch(err){
        // console.log(err)
        res.status(400).json({success:false,error:err});
    }
}

exports.inviteUserInGroup = async(req,res,next)=>{
    try{
        const {phoneNo,groupId} = req.body;
        console.log(phoneNo,groupId);
        const checkIfAdminReq = await userGroup.findOne({where:{userId:req.user.id,groupId:groupId}});
        // console.log(checkIfAdminReq);
        if(checkIfAdminReq.isAdmin){
            const findUser = await  user.findOne({where:{phoneNo:phoneNo}})
            await joinRequest.create({userId:findUser.id,groupId:groupId});     
            res.status(201).json({success:true})
        }else{
            throw new Error('your not admin')
        }    
    }catch(err){
        console.log(err)
        res.status(400).json({success:false,Error:err})
    }
}

exports.removeMember = async(req,res,next)=>{
    try{
        const {userId,groupId} = req.query;
        const reqUser = await userGroup.findOne({where:{userId:req.user.id,groupId:groupId}})
        if(reqUser.isAdmin){
            const removeUserFromGroup = await userGroup.findOne({where:{userId:userId,groupId:groupId}})
            if(!removeUserFromGroup.isAdmin){
                await removeUserFromGroup.destroy();
                res.status(201).json({success:true});
            }else{
                throw new Error({message:'user is admin cannot remove'});
            }
        }else{
            throw new Error({message:'user is admin cannot remove'});
        }
    }catch(err){
        console.log(err)
        res.status(400).json({sucess:false})
    }
}
exports.exitFromGroup = async(req,res,next)=>{
    try{
        const {groupId} = req.query;
        const getUser = await userGroup.findOne({where:{userId:req.user.id,groupId:groupId}});
        await getUser.destroy();
        
        res.status(201).json({success:true})
    }catch(err){
        res.status(500).json({success:false})
    }
}

exports.getMembersInGroup = async(req,res,next)=>{
    try{
        const groupId = req.query.GroupId;
        // console.log(GroupId);
        const isUserAdmin = await userGroup.findOne({where:{groupId,userId:req.user.id}}); 
        const admin = isUserAdmin.isAdmin;
        const groupMembers = await userGroup.findAll({where:{
                groupId:groupId,
            },
            include:[{
                model:user,
                attributes:['id','name']
            }],
            attributes:['isAdmin']
        })
        res.status(200).json({success:true,groupMembers,admin:admin});
    }catch(err){
        console.log(err)
        res.status(400).json({success:false})
    }
}

exports.search = async(req,res,next)=>{
    try{
        const {text} = req.query;
        console.log(text);
        const findByEmail = user.findAll({where:{email:text,id:{[Sequelize.Op.ne]:req.user.id}},attributes:['id','name','phoneNo']})
        const findByPhone = user.findAll({where:{phoneNo:text,id:{[Sequelize.Op.ne]:req.user.id}},attributes:['id','name','phoneNo']})
        const findByGroupName = userGroup.findAll({
            where: {
              userId: {[Sequelize.Op.ne]:req.user.id},
            },
            include: [
              {
                model: group,
                attributes: ['id', 'name'],
                where:{name:text}
              }
            ],
            attributes:['id']
          });
        const [ByEmail,ByPhone,groupName] = await Promise.all([findByEmail,findByPhone,findByGroupName])
        // console.log(ByName,ByEmail,ByPhone)
        if(ByEmail.length>0){
            res.status(200).json({success:true,users:ByEmail})
        }else if(ByPhone.length>0){
            res.status(200).json({success:true,users:ByPhone})
        }else if(groupName.length>0){
            res.status(200).json({success:true,group:groupName})
        }else{
            res.status(200).json({success:false})
        }
        
    }catch(err){
        console.log(err)
        res.status(400).json({success:false})
    }
}

exports.getGroups = async(req,res,next)=>{
    try{
        const getUserGroups = await userGroup.findAll({
            where: {
              userId: req.user.id,
            },
            include: [
              {
                model: group,
                attributes: ['id', 'name'], 
              }
            ],
            attributes: ['isAdmin'],
          });

        //   console.log(getUserGroups)
        res.status(200).json({success:true,groups:getUserGroups});
    }catch(err){
        console.log(err)
        res.status(400).json({success:false});
    }
}

exports.makeAdmin = async(req,res,next)=>{
   try{
        const {userId,groupId} = req.query;
        const makeUserAdmin = await userGroup.findOne({
            where:{userId:userId,groupId:groupId}
        })
        await makeUserAdmin.update({isAdmin:true});
        const getUser = await user.findOne({where:{id:userId},attributes:['name']})
        res.status(201).json({success:true,user:getUser});
    }catch(err){
        console.log(err);
        res.status(400).json({sucess:false})
    }
}

exports.getRequests = async(req,res,next)=>{
    try{
        const getRequest = await joinRequest.findAll({where:{
            userId:req.user.id
        },
        include: [
        {
            model: group,
            attributes: ['id', 'name'],
        }
        ]})
        
        res.status(200).json({success:true,requests:getRequest})
    }catch(err){
        res.status(500).json({success:false})
    }
}

exports.acceptRequest = async(req,res,next)=>{
    try{
        const {groupId} = req.body;
        await userGroup.create({userId:req.user.id,groupId:groupId,isAdmin:false})
        await joinRequest.destroy({where:{userId:req.user.id,groupId:groupId}});
        res.status(201).json({success:true})
    }catch(err){
        res.status(500).json({success:false})
    }
}

function isstringinvalid(getString){
   return getString === ''?true:false;
}