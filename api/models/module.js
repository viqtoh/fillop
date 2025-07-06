const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Course = require("./course");

const Module = sequelize.define(
  "Module",
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
      allowNull: false,
      defaultValue: ""
    },
    content_type: {
      type: DataTypes.ENUM("video", "pdf", "text", "ppt", "docx", "assessment"),
      allowNull: false
    },
    content_url: {
      type: DataTypes.STRING, // Path to video, PDF, document, etc.
      allowNull: true
    },
    duration: {
      type: DataTypes.STRING, // Example: "10:30" for video duration
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER, // Order in the course
      allowNull: false
    },
    file: {
      type: DataTypes.STRING,
      allowNull: true
    },
    html: {
      type: DataTypes.STRING,
      allowNull: true
    },
    assessment_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  { timestamps: true }
);

// Define relationship
Module.belongsTo(Course, { foreignKey: "courseId", onDelete: "CASCADE" });
Course.hasMany(Module, { foreignKey: "courseId" });

module.exports = Module;
