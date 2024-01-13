const user = require('../models/user');
const friend = require('../models/friend');
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

exports.searchUsers = async(req,res,next)=>{
    try{
        const {searchMember} = req.query;
        // console.log(searchMember);
        const findByName = user.findAll({where:{name:searchMember,id:{[Sequelize.Op.ne]:req.user.id}},attributes:['id','name','phoneNo']})
        const findByEmail = user.findAll({where:{email:searchMember,id:{[Sequelize.Op.ne]:req.user.id}},attributes:['id','name','phoneNo']})
        const findByPhone = user.findAll({where:{phoneNo:searchMember,id:{[Sequelize.Op.ne]:req.user.id}},attributes:['id','name','phoneNo']})
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

exports.getPhoneNo = async(req,res,next)=>{
    res.status(200).json({userPhoneNo:req.user.phoneNo});
}

exports.makeFriends = async(req,res,next)=>{
    try{
        res.status(201).json({success:true})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false})
    }
}

function isstringinvalid(getString){
    return getString === ''?true:false;
 }

function generateAccessToken(id,name,phoneNo){
    // console.log('id:,',id);
    return jwt.sign({name:name,id:id,phoneNo:phoneNo},process.env.TOKEN);
}
