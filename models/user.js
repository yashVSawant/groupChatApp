const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const user = sequelize.define('user',{
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    phoneNo:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password:Sequelize.STRING
});

module.exports =user;