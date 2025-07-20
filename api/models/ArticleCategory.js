// src/models/ArticleCategory.js
const {DataTypes} = require("sequelize");
const sequelize = require("../db");

const ArticleCategory = sequelize.define(
  "ArticleCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Category names should be unique
      set(value) {
        // Store category names in title case for consistency
        this.setDataValue("name", value.toLowerCase());
      }
    }
  },
  {
    // Optional: Add indexes for better performance on queries
    indexes: [{unique: true, fields: ["name"]}]
  }
);

module.exports = ArticleCategory;
