const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const socketIo = require('socket.io');

const app = express();

require('./service/cronJob')

const sequelize = require('./util/database');
const userRoute = require('./routes/user');
const groupRoute = require('./routes/group')
const messageRoute = require('./routes/message');

const user = require('./models/user');
const message = require('./models/message');
const archivMessage = require('./models/archiveMessages');
const group = require('./models/group');
const userGroup = require('./models/userGroup');
const joinRequest = require('./models/request');

user.belongsToMany(group,{through: userGroup});
group.belongsToMany(user,{through: userGroup});
userGroup.belongsTo(user);
userGroup.belongsTo(group);
user.hasMany(userGroup);
group.hasMany(userGroup);

user.hasMany(message);
message.belongsTo(user);
group.hasMany(message);
message.belongsTo(group);

user.hasMany(archivMessage);
archivMessage.belongsTo(user);
group.hasMany(archivMessage);
archivMessage.belongsTo(group);

user.hasMany(joinRequest);
joinRequest.belongsTo(user);
group.hasMany(joinRequest);
joinRequest.belongsTo(group);

app.use(helmet({
    contentSecurityPolicy: false,
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded())
app.use(cors({
    origin:'*',
    methods:['GET','POST','DELETE','PUT']
}));

app.use('/user',userRoute);
app.use('/group',groupRoute);
app.use('/message',messageRoute);

app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`/${req.url}`));
})
app.use((req,res)=>{
    res.status(404).send('error not found')
})

sequelize
.sync()
.then(()=>{
    // app.listen(3000);
    const server = app.listen(3000, () => {
        console.log('Server running!')
    });
    
    const io = socketIo(server)
    
    io.on('connection', (socket) => {
        // console.log('New connection',socket.id)
        socket.on('send-message',(groupId)=>{
            socket.to(groupId).emit('recive-message',groupId)
        })
        socket.on('join-group',(groupId)=>{
            // console.log(groupId)
            socket.join(groupId);
        })
        socket.on('join-phoneNo',(phoneNo)=>{
            console.log(phoneNo)
            socket.join(phoneNo);
        })
        socket.on('send-request',({phoneNo ,groupId})=>{
            const room = `${phoneNo}`;
            // console.log(room)
            socket.to(room).emit('phone-no',groupId)
        })
    })
}).catch((err)=>{
    console.log(err);
})