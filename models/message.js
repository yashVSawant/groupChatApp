const Sequelize = require('sequelize');

const sequelize= require('../util/database');

const message = sequelize.define('Message',{
    text:{
        type:Sequelize.STRING,
        allowNul:false
    }
});

module.exports = message;