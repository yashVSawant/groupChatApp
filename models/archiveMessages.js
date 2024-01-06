const Sequelize = require('sequelize');

const sequelize= require('../util/database');

const archivMessage = sequelize.define('archivMessage',{
    text:{
        type:Sequelize.TEXT
    },
    imageUrl:{
        type:Sequelize.STRING
    }
});

module.exports = archivMessage;