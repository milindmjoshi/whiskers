const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Whisky extends Model { }

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
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    // Add adminId to associate a Whisky with an Admin
    adminId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'admin', // This should match the table name for Admins, adjust as necessary
        key: 'id',
      },
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
