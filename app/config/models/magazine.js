import { DataTypes } from 'sequelize';
import sequelize from '../db.config.js';

export default () => {
  const magazine = sequelize.define(
    'magazine',
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
      publishedAt: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      schema: 'bookAndMagazine',
      freezeTableName: true,
      timestamps: false,
    },
  );
  // magazine.associate = (models) => {
  //   // magazine.belongsToMany(models.authors, {
  //   //   foreignKey: 'authors',
  //   //   targetKey: 'email',
  //   //   through: 'authorMagazineJunction',
  //   //   as: 'authorMagazineThroughTable',
  //   // });
  //   magazine.belongsToMany(models.authors, {
  //     foreignKey: {
  //       name: 'authors',
  //     },
  //     targetKey: 'email',
  //     sourceKey: 'authors',
  //     through: 'authorCommonJunction',
  //     as: 'authorsCommon',
  //   });
  // };
  return magazine;
};
