const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const friend = sequelize.define('friend',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    friendId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        unique:true
    }
});