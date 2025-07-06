const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const UserModuleProgress = sequelize.define("UserModuleProgress", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  status: {
    type: DataTypes.ENUM("not_started", "in_progress", "completed"),
    defaultValue: "not_started",
    allowNull: false
  },
  progress: {
    type: DataTypes.FLOAT, // Example: 0.0 to 1.0 or percentage
    allowNull: false,
    defaultValue: 0
  },
  last_accessed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  last_second: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

module.exports = UserModuleProgress;
