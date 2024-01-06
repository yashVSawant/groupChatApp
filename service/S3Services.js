const AWS = require('aws-sdk');
require('dotenv').config();
const uploadToS3 = (data , filename)=>{
    let s3bucket = new AWS.S3({
        accessKeyId:process.env.IAM_USER_KEY,
        secretAccessKey:process.env.IAM_USER_SECRET
    })

    console.log(">>",data.buffer);
        var param ={
            Bucket:process.env.BUCKET_NAME,
            Key: filename,
            Body: data.buffer instanceof Buffer ? data.buffer : Buffer.from(data.buffer),
            ACL: 'public-read'
        }

        return new Promise((resolve,reject)=>{
            s3bucket.upload(param ,(err,s3response)=>{
                if(err){
                    console.log(param)
                    console.log("somthing went wrong ",err)
                    reject(err)
                }else{
                    console.log('success');
                    resolve(s3response.Location);
                }
            })
        })
        

}
module.exports ={uploadToS3};
