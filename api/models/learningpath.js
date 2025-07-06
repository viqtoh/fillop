const {DataTypes} = require("sequelize");
const sequelize = require("../db");

const LearningPath = sequelize.define(
  "LearningPath",
  {
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
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING, // Path to the thumbnail image
      allowNull: true
    },
    difficulty: {
      type: DataTypes.ENUM("Beginner", "Intermediate", "Advanced"),
      allowNull: false
    },
    estimated_time: {
      type: DataTypes.STRING, // Example: "10 weeks"
      allowNull: true
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lecturer: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {timestamps: true}
);

module.exports = LearningPath;
