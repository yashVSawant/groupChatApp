const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');

const app = express();

const sequelize = require('./util/database');
const userRoute = require('./routes/user');
const messageRoute = require('./routes/message');

const user = require('./models/user');
const message = require('./models/message');

user.hasMany(message);
message.belongsTo(user);

app.use(helmet({
    contentSecurityPolicy: false,
  }))
app.use(bodyParser.json());
app.use(cors({
    origin:'*',
    methods:['GET','POST','DELETE','PUT']
}));

app.use('/user',userRoute);
app.use('/message',messageRoute);
app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`frontend/${req.url}`));
})
app.use((req,res)=>{
    res.status(404).send('error not found')
})

sequelize
.sync()
.then(()=>{
    app.listen(3000);
})