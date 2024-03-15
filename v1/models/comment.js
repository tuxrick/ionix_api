const Sequelize = require('sequelize')
const db = require('../utils/db')

module.exports = db.sequelize.define(
  'comment',
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
      allowNull: false,
    },
    id_task: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    comment: {
        type: Sequelize.STRING,
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