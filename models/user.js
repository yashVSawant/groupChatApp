const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const user = sequelize.define('User',{
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    phoneNo:Sequelize.STRING,
    password:Sequelize.STRING
});

module.exports =user;