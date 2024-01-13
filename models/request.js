const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const request = sequelize.define('request',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    }
});

module.exports = request;