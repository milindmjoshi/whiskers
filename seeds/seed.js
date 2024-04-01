//Seed that base boys
const sequelize = require('../config/connection');
const { User, Whiskey, Rating } = require('../models');

const userData = [
  { username: 'john_doe' },
  { username: 'jane_smith' },
  { username: 'alex_williams' },
];

const whiskeyData = [
  { name: 'Macallan 18', type: 'Scotch', origin: 'Scotland' },
  { name: 'Buffalo Trace', type: 'Bourbon', origin: 'USA' },
  { name: 'Jameson', type: 'Irish', origin: 'Ireland' },
];

const ratingData = [
  { rating: 5 },
  { rating: 4 },
  { rating: 3 },
];

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
    });

    const whiskeys = await Whiskey.bulkCreate(whiskeyData, {
      returning: true,
    });

    const ratings = await Rating.bulkCreate(ratingData, {
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

