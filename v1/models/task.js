const Sequelize = require('sequelize')
const db = require('../utils/db')

module.exports = db.sequelize.define(
  'task',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
	    unique: true, 
      allowNull: false,
      autoIncrement: true
    },
    id_user: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    id_status: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    due_date: {
      type: Sequelize.DATE,
    },
    created: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
  },
  {
    timestamps: false
  }
)