import { DataTypes } from 'sequelize';
import sequelize from '../db.config.js';

export default () => {
  const books = sequelize.define(
    'books',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      isbn: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      authors: {
        type: DataTypes.ARRAY(DataTypes.STRING(50)),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
    },
    {
      schema: 'bookAndMagazine',
      freezeTableName: true,
    },
  );

  // books.associate = (models) => {

  //   books.belongsToMany(models.authors, {
  //     targetKey: 'email',
  //     sourceKey: 'authors',
  //     through: 'authorBookJun',
  //     as: 'authorsBookJunThr',
  //   });
  // };

  return books;
};
