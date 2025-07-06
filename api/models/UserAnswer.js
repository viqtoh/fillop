const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const AssessmentAttempt = require("./AssessmentAttempt");
const AttemptQuestion = require("./AttemptQuestion");
const Option = require("./Option");

const UserAnswer = sequelize.define("UserAnswer", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
});

UserAnswer.belongsTo(AssessmentAttempt, { foreignKey: "AttemptId", onDelete: "CASCADE" });
UserAnswer.belongsTo(AttemptQuestion, { foreignKey: "AttemptQuestionId", onDelete: "CASCADE" });
UserAnswer.belongsTo(Option, { foreignKey: "OptionId", onDelete: "CASCADE" });

module.exports = UserAnswer;
