const Sequelize = require('sequelize');

const sequelize= require('../util/database');

const message = sequelize.define('Message',{
    text:{
        type:Sequelize.TEXT
    },
    imageUrl:{
        type:Sequelize.STRING
    }
});

module.exports = message;