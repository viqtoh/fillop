const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Module = require("./module");

const Assessment = sequelize.define("Assessment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  numberOfQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
});

Assessment.belongsTo(Module, { foreignKey: "ModuleId", onDelete: "CASCADE" });

module.exports = Assessment;
