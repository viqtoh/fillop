require("dotenv").config({path: "../.env"});
const {Pool} = require("pg");

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: false
});

pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err));

module.exports = pool;

const {Sequelize} = require("sequelize");

// Create a new Sequelize instance
const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    dialect: "postgres",
    logging: false
  }
);

// Test the connection
sequelize
  .authenticate()
  .then(() => console.log("✅ Tested PostgreSQL successfully!"))
  .catch((err) => console.error("❌ PostgreSQL connection error:", err));

module.exports = sequelize;
