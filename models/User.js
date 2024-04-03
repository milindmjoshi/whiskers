const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
      },
    },
    security_question: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'What was your childhood pets name?' // Default security question
    },
    security_answer: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'bingo', // Default security answer
      // Ensure the security answer is stored in lowercase
      set(value) {
        this.setDataValue('security_answer', value.toLowerCase());
      }
    },
  },
  {

    hooks: {
      beforeCreate: async (newUserData) => {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        // newUserData.security_answer = newUserData.security_answer.toLowerCase();
        return newUserData;
      },
      beforeUpdate: async (updatedUserData) => {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        // updatedUserData.security_answer = updatedUserData.security_answer.toLowerCase();
        return updatedUserData;
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
  }

);

module.exports = User;
