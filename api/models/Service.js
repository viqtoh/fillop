const {DataTypes} = require("sequelize");
const sequelize = require("../db"); // Assuming your sequelize instance is in db.js
const slugify = require("slugify"); // For generating URL-friendly slugs

const Service = sequelize.define(
  "Service",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Service titles should ideally be unique
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Slugs must be unique for URL identification
    },
    fullDescription: {
      type: DataTypes.TEXT, // Detailed description, can be long
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING, // URL for the service's main image/icon
      allowNull: true
    },
    targetClients: {
      type: DataTypes.TEXT, // Description of primary target clients
      allowNull: true
    },
    competitiveAdvantage: {
      type: DataTypes.TEXT, // Description of competitive advantages
      allowNull: true
    },
    visitLink: {
      type: DataTypes.STRING, // External link related to the service
      allowNull: true
    },
    // You might want to add a 'status' or 'isActive' field for toggling visibility
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    // Hooks for automatically generating slug before validation
    hooks: {
      beforeValidate: async (service) => {
        if (service.title && service.changed("title")) {
          // Generate slug only if title is provided and has changed
          service.slug = slugify(service.title, {
            lower: true, // convert to lower case
            strict: true, // strip characters not allowed in URLs
            remove: /[*+~.()'"!:@]/g // remove specific characters
          });

          // Ensure slug uniqueness
          let count = 0;
          let newSlug = service.slug;
          while (await Service.findOne({where: {slug: newSlug}})) {
            count++;
            newSlug = `${service.slug}-${count}`;
          }
          service.slug = newSlug;
        }
      }
    },
    // Optional: Add indexes for better performance on queries
    indexes: [
      {unique: true, fields: ["slug"]},
      {unique: true, fields: ["title"]}
    ]
  }
);

module.exports = Service;
