const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Question = require("./Question");

const AttemptQuestion = sequelize.define("AttemptQuestion", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
});

module.exports = AttemptQuestion;
