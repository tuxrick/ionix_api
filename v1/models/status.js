const Sequelize = require('sequelize')
const db = require('../utils/db')

module.exports = db.sequelize.define(
  'status',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
	  unique: true, 
      allowNull: false,
      autoIncrement: true
    },
    status: {
      type: Sequelize.STRING,
    }
  },
  {
    timestamps: false
  }
)