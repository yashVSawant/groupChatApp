const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
// const server = http.createServer(app);

// const io = socketIo(server);

const sequelize = require('./util/database');
const userRoute = require('./routes/user');
const messageRoute = require('./routes/message');

const user = require('./models/user');
const message = require('./models/message');
const group = require('./models/group');
const userGroup = require('./models/userGroup');
const imageUrl = require('./models/imageUrl');

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
group.hasMany(imageUrl);
imageUrl.belongsTo(group);

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
        console.log('New connection',socket.id)
        socket.on('send-message',(groupId)=>{
            socket.to(groupId).emit('recive-message',groupId)
        })
        socket.on('join-group',(groupId)=>{
            socket.join(groupId);
        })
        // socket.on('join-newGroup',(groupId)=>{
        //     socket.to(groupId).emit('joined-newGroup',groupId);
        // })
    })
}).catch((err)=>{
    console.log(err);
})