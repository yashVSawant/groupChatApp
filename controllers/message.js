const message = require('../models/message');
const user = require('../models/user');

exports.getMessages = async(req,res,next)=>{
    try{
        const count = req.query.count;
        // console.log('count>>>',count)
        const totalMsg = await message.count();
        // console.log(totalMsg)
        if(count!=totalMsg){
            const chats = await message.findAll({
                offset:+count,
                attributes:['text','UserEmail'],
                include: [{ model: user, attributes: ['name'] }]
            })
            res.status(200).json({success:true,chats,totalMsg});
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
        const {text} = req.body;
        const Msg = await message.create({text,UserEmail:req.user.email})
        res.status(201).json({Msg})
    }catch(err){
        // console.log(err)
        res.status(400).json({success:false,error:err})
    }
}