import { DataTypes } from 'sequelize';
import sequelize from '../db.config.js';

export default () => {
  const authors = sequelize.define(
    'authors',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
          args: true,
          msg: 'Duplicate email found',
        },
        isEmail: true,
      },
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      schema: 'bookAndMagazine',
      freezeTableName: true,
      timestamps: false,
    },
  );

  return authors;

  // authors.associate = (models) => {
  //   authors.hasMany(models.books, {
  //     foreignKey: 'authors',
  //     sourceKey: 'email',
  //   });
  // };
};
