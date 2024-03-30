const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
// TODO: Update everything for Whisky
class Whisky extends Model {}

Whisky.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    averageRating: {
      type: DataTypes.ENUM,
      values: ['1', '2', '3', '4', '5']
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'whiskey',
  }
);

module.exports = Whisky;
