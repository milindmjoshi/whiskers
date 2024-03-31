const User = require('./User');
const Whisky = require('./Whisky');
const Rating = require('./Rating');

User.hasMany(Rating, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

Rating.belongsTo(User, {
  foreignKey: 'userId'
});


Whisky.hasMany(Rating, { 
  foreignKey: 'whiskyId',
  onDelete: 'CASCADE' 
});

Rating.belongsTo(Whisky, { 
  foreignKey: 'whiskyId' 
});

module.exports = { User, Whisky, Rating };
