const fs = require('fs');
const path = require('path');
const sequelize = require('../config/connection');
const { User, Whisky, Rating, Admin } = require('../models');

const seedDatabase = async () => {
  try {
    // Read data from JSON files
    const userData = JSON.parse(fs.readFileSync(path.join(__dirname, 'userData.json'), 'utf-8'));
    const whiskeyData = JSON.parse(fs.readFileSync(path.join(__dirname, 'whiskydata.json'), 'utf-8'));
    const ratingData = JSON.parse(fs.readFileSync(path.join(__dirname, 'ratingData.json'), 'utf-8'));
    const adminData = JSON.parse(fs.readFileSync(path.join(__dirname, 'adminData.json'), 'utf-8'));

    // N-Sync database
    await sequelize.sync({ force: true });

    // Seed users
    const users = await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
    });

    // Seed whiskeys
    const whiskeys = await Whiskey.bulkCreate(whiskeyData, {
      returning: true,
    });

    // Seed ratings
    const ratings = await Rating.bulkCreate(ratingData, {
      returning: true,
    });

    // Seed admins
    const admins = await Admin.bulkCreate(adminData, {
      returning: true,
    });

    // Associate ratings with users and whiskeys
    for (let i = 0; i < users.length; i++) {
      await ratings[i].setUser(users[i]);
      await ratings[i].setWhiskey(whiskeys[i]);
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
