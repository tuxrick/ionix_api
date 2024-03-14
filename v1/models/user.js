const Sequelize = require('sequelize')
const db = require('../utils/db')

module.exports = db.sequelize.define(
  'user',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
	  unique: true, 
      allowNull: false,
      autoIncrement: true
    },
    email: {
      type: Sequelize.STRING,
	  unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
	    unique: false,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
    },
    last_name: {
        type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.STRING,
      defaultValue: "executor"
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