const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const resetPasswordRequest = sequelize.define('resetPasswordRequest',{
    id:{
        type:Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey:true,
    },
    isActive:Sequelize.BOOLEAN
});

module.exports = resetPasswordRequest;