const user = require('../models/user');
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

function isstringinvalid(getString){
   return getString === ''?true:false;
}

function generateAccessToken(id,name,phoneNo){
    return jwt.sign({userId:id , name:name ,phoneNo:phoneNo},process.env.TOKEN);
}