'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

require('dotenv').config();

const config = require(path.join(__dirname, '/../config/database.js'))[env];

const db = {
};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const initializeModels = async () => {
  try {
    const files = fs.readdirSync(__dirname).filter(file => (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    ));

    for (const file of files) {
      const modelPath = path.join(__dirname, file);
      try {
        const model = require(modelPath)(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
      } catch (error) {
        console.error(`Error requiring model file ${file}:`, error);
      }
    }

    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });
  } catch (error) {
    console.error('Error initializing models:', error);
  }
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

const initializeDatabase = async () => {
  await connectToDatabase();
  await initializeModels();
};

initializeDatabase();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
