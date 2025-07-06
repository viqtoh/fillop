const User = require("./user");
const Course = require("./course");
const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const LearningPath = require("./learningpath");

const UserProgress = sequelize.define(
  "UserProgress",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id"
      }
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Course,
        key: "id"
      }
    },
    learningPathId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: LearningPath,
        key: "id"
      }
    }
  },
  { timestamps: true }
);

UserProgress.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
UserProgress.belongsTo(Course, { foreignKey: "courseId", onDelete: "CASCADE" });
UserProgress.belongsTo(LearningPath, { foreignKey: "learningPathId", onDelete: "CASCADE" });

module.exports = UserProgress;
