const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const group = sequelize.define('group',{
    name:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports = group;