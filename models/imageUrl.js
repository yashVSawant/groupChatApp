const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const imageUrl = sequelize.define('imageUrl',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    url:Sequelize.STRING
});

module.exports = imageUrl;