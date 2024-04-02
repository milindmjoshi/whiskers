const User = require('./User');
const Whisky = require('./Whisky');
const Rating = require('./Rating');
const Admin = require('./Admin'); 

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

// Admin to Whisky association
Admin.hasMany(Whisky, {
  foreignKey: 'adminId', 
  onDelete: 'CASCADE',
});

Whisky.belongsTo(Admin, {
  foreignKey: 'adminId', 
});

module.exports = { User, Whisky, Rating, Admin };
