
const fs = require('fs');
const path = require('path');
const sequelize = require('../config/connection');
const { User, Whisky, Rating, Admin } = require('../models');

const userData = require('./userData.json');
const whiskyData = require('./whiskyData.json');
const ratingData = require('./ratingData.json');
const adminData = require('./adminData.json');


const seedDatabase = async () => {
  try {
    // Read data from JSON files
    // const userData = JSON.parse(fs.readFileSync(path.join(__dirname, 'userData.json'), 'utf-8'));
    // const whiskeyData = JSON.parse(fs.readFileSync(path.join(__dirname, 'whiskydata.json'), 'utf-8'));
    // const ratingsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'ratingsData.json'), 'utf-8'));
    // const adminData = JSON.parse(fs.readFileSync(path.join(__dirname, 'adminData.json'), 'utf-8'));


    // N-Sync database
    await sequelize.sync({ force: true });


    await Admin.bulkCreate(adminData, {
      individualHooks: true,
      returning: true,
    });

    // Seed users
    await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
    });

    // // Seed whiskeys
    await Whisky.bulkCreate(whiskyData, {
      individualHooks: true,
      returning: true,
    });

    // // Seed ratings
    await Rating.bulkCreate(ratingData, {
      individualHooks: true,
      returning: true,
    });





    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();

