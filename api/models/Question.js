const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Assessment = require("./Assessment");

const Question = sequelize.define("Question", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  aid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  multiAnswer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  module: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

Question.belongsTo(Assessment, { foreignKey: "AssessmentId", onDelete: "CASCADE" });

module.exports = Question;
