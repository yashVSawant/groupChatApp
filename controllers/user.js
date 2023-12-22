const user = require('../models/user');
const bcrypt = require('bcrypt')

exports.getUsers = async(req,res,next)=>{
        const reqBody = req.body;
        console.log(reqBody)
        const saltRound = 10;
        bcrypt.hash(reqBody.password,saltRound,async(err,hash)=>{
            try{
            console.log('error from user.controller>>>',err);
            await user.create({
                email:reqBody.email,
                name:reqBody.name,
                phoneNo:reqBody.phoneNo,
                password:hash
            });
                res.status(201).json({success:true,message:'user successfully signup'})
            }catch(err){
                res.status(500).json({success:false,message:'email already exist!'})
            }
        })
}

function encryptPassword (password){

}