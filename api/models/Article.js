const {DataTypes} = require("sequelize");
const sequelize = require("../db");
const ArticleCategory = require("./ArticleCategory"); // Import category model
const slugify = require("slugify"); // For generating URL-friendly slugs

const Article = sequelize.define(
  "Article",
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
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Slugs must be unique for URL identification
    },
    content: {
      type: DataTypes.TEXT, // Use TEXT for potentially long content
      allowNull: false
    },
    publishedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW // Default to current timestamp on creation
    },
    imageUrl: {
      type: DataTypes.STRING, // URL to the article's main image
      allowNull: true // Can be null if not all articles have images
    },
    authorName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Anonymous"
    },
    authorImageUrl: {
      type: DataTypes.STRING, // URL to the author's profile image
      allowNull: true
    },
    viewed_ips: {
      type: DataTypes.JSON, // works with MySQL, SQLite, and PostgreSQL
      defaultValue: []
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0 // For popularity/trending
    },
    // Foreign key for category
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: ArticleCategory, // This is a reference to the ArticleCategory model
        key: "id" // Use the 'id' column of ArticleCategory
      },
      allowNull: false
    }
  },
  {
    // Hooks for automatically generating slug before validation
    hooks: {
      beforeValidate: async (article) => {
        if (article.title && article.changed("title")) {
          // Generate slug only if title is provided and has changed
          article.slug = slugify(article.title, {
            lower: true, // convert to lower case
            strict: true, // strip characters not allowed in URLs
            remove: /[*+~.()'"!:@]/g // remove specific characters
          });

          // Ensure slug uniqueness (simple approach, can be more robust for edge cases)
          let count = 0;
          let newSlug = article.slug;
          while (await Article.findOne({where: {slug: newSlug}})) {
            count++;
            newSlug = `${article.slug}-${count}`;
          }
          article.slug = newSlug;
        }
      }
    },
    // Optional: Add indexes for better performance on queries
    indexes: [
      {unique: true, fields: ["slug"]},
      {fields: ["categoryId"]},
      {fields: ["publishedDate"]},
      {fields: ["views"]}
    ]
  }
);

// Define associations
Article.belongsTo(ArticleCategory, {foreignKey: "categoryId", as: "category"});
ArticleCategory.hasMany(Article, {foreignKey: "categoryId", as: "articles"});

module.exports = Article;
