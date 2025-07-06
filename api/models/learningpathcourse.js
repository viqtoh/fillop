const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const LearningPathCourse = sequelize.define(
  "LearningPathCourse",
  {
    orderIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  { timestamps: false }
);

module.exports = LearningPathCourse;
