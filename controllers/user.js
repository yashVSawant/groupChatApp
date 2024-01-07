const user = require('../models/user');
const group = require('../models/group');
const userGroup = require('../models/userGroup');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');


exports.signupUser = async(req,res,next)=>{
        const {email,name,phoneNo,password} = req.body;
        
        const saltRound = 10;
        bcrypt.hash(password,saltRound,async(err,hash)=>{
            try{
            if(!err){
                await user.create({
                    email:email,
                    name:name,
                    phoneNo:phoneNo,
                    password:hash
                });
                res.status(201).json({success:true,message:'user successfully signup'})
            }else{
                console.log(err)
            }
            
            }catch(err){
                res.status(500).json({success:false,message:'email already exist!'})
            }
        })
}

exports.loginUser = async(req,res,next)=>{
    const {email,password} = req.body;
    try{
        if(isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err:'bad parameter : somthing went wrong'})
        }
        const checkUser = await user.findOne({where:{email:email}});
        if(checkUser){
            bcrypt.compare(password,checkUser.password,(err,result)=>{
                if(err){
                    res.status(500).json({success:false ,message:'something went wrong !'})                   
                }
                if(result){
                    res.status(201).json({success:true ,message:'User login succesfull',token:generateAccessToken(checkUser.id,checkUser.name,checkUser.phoneNo)})
                }else{
                    res.status(401).json({success:false ,message:'incorrect password !'})
                }
            })
        }
        else res.status(404).json({success:false ,message:'User not found'})
        
    }catch(err){
        // console.log(err)
        res.status(500).json({success:false,message:err});
    }
}

exports.createGroup = async(req,res,next)=>{
    try{
        const {name} = req.body;
        // console.log('name..>',name);
        const groupInstace =  await group.create({name,UserId:req.user.id});
        const getNewGroup = await userGroup.create({GroupId:groupInstace.id,UserId:req.user.id,isAdmin:true});
        res.status(201).json({success:true,group:getNewGroup});
    }catch(err){
        // console.log(err)
        res.status(400).json({success:false,error:err});
    }
}

exports.addUserToGroup = async(req,res,next)=>{
    try{
        const {memberInfo,groupId} = req.body;
        const checkIfAdminReq = await userGroup.findOne({where:{UserId:req.user.id,GroupId:groupId}});
        // console.log(checkIfAdminReq.isAdmin);
        if(checkIfAdminReq.isAdmin){
            const findUserToAddByEmail =   user.findOne({where:{email:memberInfo}})
            const findUserToAddByNo =   user.findOne({where:{phoneNo:memberInfo}})
            
            const [getUserToAddByEmail,getUserToAddByNo] = await Promise.all([findUserToAddByEmail, findUserToAddByNo])
            if(getUserToAddByEmail){
                await userGroup.create({UserId:getUserToAddByEmail.id,GroupId:groupId});
            }else{
                await userGroup.create({UserId:getUserToAddByNo.id,GroupId:groupId});
            }   
            res.status(201).json({success:true})
        }else{
            throw new Error('your not admin')
        }    
    }catch(err){
        console.log(err)
        res.status(400).json({success:false,Error:err})
    }
}

exports.getMembersInGroup = async(req,res,next)=>{
    try{
        const GroupId = req.query.GroupId;
        // console.log(GroupId);
        const isUserAdmin = await userGroup.findOne({where:{GroupId,UserId:req.user.id}}); 
        const admin = isUserAdmin.isAdmin;
        const groupMembers = await userGroup.findAll({where:{
                GroupId:GroupId,
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

exports.searchUsers = async(req,res,next)=>{
    try{
        const {searchMember} = req.query;
        // console.log(searchMember);
        const findByName = user.findAll({where:{name:searchMember},attributes:['id','name','phoneNo']})
        const findByEmail = user.findAll({where:{email:searchMember},attributes:['id','name','phoneNo']})
        const findByPhone = user.findAll({where:{phoneNo:searchMember},attributes:['id','name','phoneNo']})
        const [ByName,ByEmail,ByPhone] = await Promise.all([findByName,findByEmail,findByPhone])
        // console.log(ByName,ByEmail,ByPhone)
        if(ByName.length>0){
            res.status(200).json({success:true,users:ByName})
        }else if(ByEmail.length>0){
            res.status(200).json({success:true,users:ByEmail})
        }else if(ByPhone.length>0){
            res.status(200).json({success:true,users:ByPhone})
        }else{
            res.status(200).json({success:true,users:''})
        }
        
    }catch(err){
        res.status(400).json({success:false})
    }
}

exports.getGroups = async(req,res,next)=>{
    try{
        const getUserGroups = await userGroup.findAll({
            where: {
              UserId: req.user.id,
            },
            include: [
              {
                model: group,
                attributes: ['id', 'name'], // Specify the attributes you want to retrieve from the 'group' table
              }
            ],
            attributes: ['isAdmin'],
          });
        res.status(200).json({success:true,groups:getUserGroups});
    }catch(err){
        console.log(err)
        res.status(400).json({success:false});
    }
}

exports.removeMember = async(req,res,next)=>{
    try{
        const {userId,groupId} = req.query;
        const removeUserFromGroup = await userGroup.findOne({where:{UserId:userId,GroupId:groupId}})
        await removeUserFromGroup.destroy();
        res.status(201).json({success:true});
    }catch(err){
        console.log(err)
        res.status(400).json({sucess:false})
    }
}

exports.makeAdmin = async(req,res,next)=>{
   try{
        const {userId,groupId} = req.query;
        const makeUserAdmin = await userGroup.findOne({
            where:{UserId:userId,GroupId:groupId}
        })
        await makeUserAdmin.update({isAdmin:true});
        const getUser = await user.findOne({where:{id:userId},attributes:['name']})
        res.status(201).json({success:true,user:getUser});
    }catch(err){
        console.log(err);
        res.status(400).json({sucess:false})
    }
}

exports.getPhoneNo = async(req,res,next)=>{
    res.status(200).json({userPhoneNo:req.user.phoneNo});
}

function isstringinvalid(getString){
   return getString === ''?true:false;
}

function generateAccessToken(id,name,phoneNo){
    // console.log('id:,',id);
    return jwt.sign({name:name,id:id,phoneNo:phoneNo},process.env.TOKEN);
}
