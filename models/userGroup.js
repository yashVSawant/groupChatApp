const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const userGroup = sequelize.define('UserGroup',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false, 
      }
});

module.exports = userGroup;