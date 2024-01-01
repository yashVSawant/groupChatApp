const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const group = sequelize.define('Group',{
    name:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports = group;