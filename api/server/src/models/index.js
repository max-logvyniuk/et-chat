import fs from 'fs';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import startsWith from 'lodash/startsWith'
import path from 'path';
import Sequelize from 'sequelize';
import configJson from '../config/config';

const basename = path.basename(__filename);
const environment = process.env.NODE_ENV || 'development';
console.info('env', environment);
const config = configJson[environment];

const database = {};

let sequelize;
if (config.environment === 'production') {
  sequelize = new Sequelize(config.databaseUrl,
    {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOption: {
        ssl: true,
        native: true,
      },
    });

} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

forEach(
  filter(fs.readdirSync(__dirname), file => {
    return (
      !startsWith(file, '.') && file !== basename && file.slice(-3) === '.js'
    );
  }),
  file => {
    const model = sequelize.import(path.join(__dirname, file));
    database[model.name] = model;
  },
);

forEach(keys(database), modelName => {
  if (database[modelName].associate) {
    database[modelName].associate(database);
  }
});

database.sequelize = sequelize;
database.Sequelize = Sequelize;

export default database;
