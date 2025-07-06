const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Question = require("./Question");

const Option = sequelize.define("Option", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  qid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

Option.belongsTo(Question, { foreignKey: "QuestionId", onDelete: "CASCADE" });

module.exports = Option;
