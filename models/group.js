const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const group = sequelize.define('Group',{
    name:Sequelize.STRING
});

module.exports = group;