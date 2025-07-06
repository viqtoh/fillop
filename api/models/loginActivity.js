const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const LoginActivity = sequelize.define(
  "LoginActivity",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = LoginActivity;
