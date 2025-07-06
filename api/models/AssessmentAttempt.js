const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./user");
const Assessment = require("./Assessment");

const AssessmentAttempt = sequelize.define("AssessmentAttempt", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  status: {
    type: DataTypes.ENUM("in_progress", "completed"),
    defaultValue: "in_progress"
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

AssessmentAttempt.belongsTo(User, { foreignKey: "UserId", onDelete: "CASCADE" });
AssessmentAttempt.belongsTo(Assessment, { foreignKey: "AssessmentId", onDelete: "CASCADE" });

module.exports = AssessmentAttempt;
