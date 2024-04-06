const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const fileUpload = require('express-fileupload');
const fs = require('fs')
// const exphbs = require('express-handlebars');


// hbs.registerPartials(path.join(__dirname, 'views/partials'));

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });
hbs.handlebars.registerPartial('nav', fs.readFileSync(__dirname + '/views/partials/whisky-card.handlebars', 'utf8'));
hbs.handlebars.registerPartial('whiskeyCardPartial', fs.readFileSync(__dirname + '/views/partials/whiskeyCardPartial.handlebars', 'utf-8'));


const sess = {
  secret: 'Super secret secret',
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

// Used to upload whisky image files
app.use(fileUpload()); 

// Inform Express.js on which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});

// hbs.handlebars.registerPartial('whiskeyCardPartial', whiskeyCardPartial, 'utf-8');