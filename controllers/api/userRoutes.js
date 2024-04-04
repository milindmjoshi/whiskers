const router = require('express').Router();
const { User, Admin } = require('../../models');


/*
POST http://localhost:3001/api/users
 Sample POST body for creating a user, you can use insomnia to create this
 {
    "name" : "John Kennedy",
    "email": "john@gmail.com",
    "password":"password"
 }


*/
router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

/*
POST http://localhost:3001/api/users/login
 Sample POST body for logging in a user, you can use insomnia to test
 {
    "email": "john@gmail.com",
    "password":"password"
 }


*/
router.post('/login', async (req, res) => {
  try {

    let validPassword;
    let adminData;

    // First check user table
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {

      // if not user see if an admin is logging in
      console.log("Checking admin table");
      adminData = await Admin.findOne({ where: { email: req.body.email } });
      console.log("Done admin table");


      if (!adminData){
        console.log("Not in admin table");
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
      }
      else{
        console.log("checking admin password " + JSON.stringify(adminData));
        validPassword =   adminData.checkPassword(req.body.password);
        console.log("admin logged in " + req.body.email); 
      }
    }
    else{
      validPassword =   userData.checkPassword(req.body.password);
      console.log("User logged in " + req.body.email); 

    }

 

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      console.log("Saving Session");
      if (userData){
        console.log("Set user in session");
        req.session.user_id = userData.id;
      }
      else {
        console.log("Set admin in session");
        req.session.user_id = adminData.id;
        req.session.isAdmin = true;
      }
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});




router.post('/signup', async (req, res) => {

  console.log(req.body)
  try {
    // Check if user already exists with the given email
    const existingUser = await User.findOne({ where: { email: req.body.email } });

    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Create a new user with the provided name, email, and password
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    // Return a successful response message
    res.status(200).json({ message: 'Your account has been created successfully! Please log in.' });

  } catch (err) {
    console.error('Failed to create account:', err);
    res.status(500).json({ message: 'Failed to sign up. Please try again later.' });
  }
});

/*
POST http://localhost:3001/api/users/logout
 Sample POST body for logging out a user, you can use insomnia to test
 {
    "email": "john@gmail.com",
    "password":"password"
 }


*/
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    console.log("User Logging out: " + JSON.stringify(req.session));
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
