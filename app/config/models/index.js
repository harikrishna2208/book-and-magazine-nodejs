import { Sequelize } from 'sequelize';
import sequelize from '../db.config.js';
import books from './books.js';
import authors from './authors.js';
import magazine from './magazine.js';

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.authors = authors();
db.books = books();
db.magazine = magazine();

// Associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
