const { Model, DataTypes } = require('sequelize');
const User = require('./User');
const Whisky = require('./Whisky');
const sequelize = require('../config/connection');
// TODO: Update everything for Whisky
class Rating extends Model { }

Rating.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    whiskyId: {
        type: DataTypes.INTEGER,
        references: {
            model: Whisky,
            key: 'id'
        }
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    text: {
        type: DataTypes.TEXT
    },
    commentDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},
{
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'rating',
  }
);

module.exports = Rating;
