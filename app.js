const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const sequelize = require('./util/database');
const userRoute = require('./routes/user');

app.use(bodyParser.json());
app.use(cors());

app.use('/user',userRoute);

sequelize
.sync()
.then(()=>{
    app.listen(3000);
})