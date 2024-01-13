const path = require('path');
const resetPasswordRequest = require('../models/FPRequest');
const bcrypt = require('bcrypt');
const user = require('../models/user');
const Sib = require('sib-api-v3-sdk');
let client = Sib.ApiClient.instance;
require('dotenv').config();

exports.getResetPasswordMail =async (req,res,next)=>{
    const userMail = req.body.email;
    console.log(userMail);
    let apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.SIB_API_KEY;
    const tranEmailApi = new Sib.TransactionalEmailsApi();
   console.log('1')
    const sender = {
        email:process.env.EMAIL
    }
    console.log('2')
    const receivers =[
        {email:userMail},
    ]
    try{
        const requestUser = await user.findOne({where:{email:userMail}})
        if(!requestUser) throw new Error(JSON.stringify(err));
        const createRequest = await resetPasswordRequest.create({UserId:requestUser.id,isActive:true});
        console.log("createRequest ",createRequest.id );
        console.log(requestUser.id);
        await tranEmailApi.sendTransacEmail({
            sender,
            to:receivers,
            subject:'reset password link',
            textContent:`
            checking msg http://loacalhost:3000/password/resetpassword/${createRequest.id}
            `
            
        })
        res.status(200).send('forgotPassword')
    }catch(err){
        console.log(err)
        res.status(400).json({success:false,error:err})
    }
}

exports.resetPasswordLink = async(req,res,next)=>{
    const id = req.params.id;
    console.log("request id:",id);
    try{
        const userRequest = await resetPasswordRequest.findByPk(id);
        if(userRequest && userRequest.isActive){
            res.sendFile(path.join(__dirname,'..','frontend','html','resetPassword.html'))
        }else{
            res.status(404).send('no request found')
        }
    }catch(err){
        console.log(err);
        res.status(404).send('something went wrong!');
    }
}

exports.setNewPassword = async(req,res)=>{
    const newPassword = req.body.password;
    const id = req.body.id;
    try{
        const userRequest = await resetPasswordRequest.findByPk(id);
        if(userRequest && userRequest.isActive){
            const saltRound = 10;
            bcrypt.hash(newPassword,saltRound,async(err,hash)=>{
                console.log('error from user.controller>>>',err);
                try{
                    const getUser = await user.findByPk(userRequest.UserId)
                    await getUser.update({
                        password:hash
                    });
                    await userRequest.update({
                        isActive:false
                    })
                    res.status(201).send('password updated successfully');
                }catch(err){
                    res.status(403).send('something went wrong!');
                }  
            })
        }
    }catch(err){
        console.log(err)
        res.status(403).send('something went wrong!');
    }
   
}
