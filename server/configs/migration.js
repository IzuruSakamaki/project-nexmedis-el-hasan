require('dotenv').config();

const config = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'database_development',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: process.env.DB_DIALECT || 'postgres',
  },
  staging: {
    username: process.env.DB_USER_STAGING || 'root',
    password: process.env.DB_PASSWORD_STAGING || null,
    database: process.env.DB_NAME_STAGING || 'database_staging',
    host: process.env.DB_HOST_STAGING || '127.0.0.1',
    dialect: process.env.DB_DIALECT_STAGING || 'postgres',
  },
  production: {
    username: process.env.DB_USER_PRODUCTION || 'root',
    password: process.env.DB_PASSWORD_PRODUCTION || null,
    database: process.env.DB_NAME_PRODUCTION || 'database_production',
    host: process.env.DB_HOST_PRODUCTION || '127.0.0.1',
    dialect: process.env.DB_DIALECT_PRODUCTION || 'postgres',
  }
};

const env = process.env.NODE_ENV || 'development';
const selectedConfig = config[env];

module.exports = selectedConfig;