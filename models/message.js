const Sequelize = require('sequelize');

const sequelize= require('../util/database');

const message = sequelize.define('Message',{
    text:{
        type:Sequelize.TEXT,
        allowNul:false
    }
});

module.exports = message;