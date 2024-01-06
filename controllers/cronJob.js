const { CronJob } =require('cron');

const Sequelize = require('sequelize')

const archivMessage = require('../models/archiveMessages');
const message = require('../models/message');

const job = new CronJob(
	'* * * * * ', // cronTime
	async function () {
		// console.log('one', new Date());
        const currentDate = new Date();
        const oneDayAgo = new Date(currentDate);
        oneDayAgo.setDate(currentDate.getDate() - 1);

        // const data = await archivMessage.findAll({where:{createdAt:{[Sequelize.Op.lt]: oneDayAgo}}});
        // console.log(data,oneDayAgo)
        try{
            const getAllMessage = await message.findAll({where:{createdAt:{[Sequelize.Op.lt]: oneDayAgo}}});
            const storeGetMessages = getAllMessage.map((item)=>({
                text:item.text,
                imageUrl:item.imageUrl,
                UserId:item.UserId,
                GroupId:item.GroupId
            }))
            await archivMessage.bulkCreate(storeGetMessages);
            // console.log(getAllMessage);
            message.destroy({where:{createdAt:{[Sequelize.Op.lt]: oneDayAgo}}})
        }catch(err){
            console.log(err)
        }
	}, // onTick
	null, // onComplete
	true, // start
	'Asia/Kolkata' // timeZone
);

module.exports = job;