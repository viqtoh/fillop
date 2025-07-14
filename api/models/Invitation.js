const {DataTypes} = require("sequelize");
const sequelize = require("../db");

const Invitation = sequelize.define(
  "Invitation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LearningPathId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lecturerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending"
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = Invitation;
