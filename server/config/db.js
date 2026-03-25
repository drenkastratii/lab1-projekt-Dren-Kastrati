const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env'), override: true });

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS || undefined,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    }
);

module.exports = sequelize;
