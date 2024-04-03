const router = require('express').Router();
const { User, Rating, Whisky } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
  try {
    // Render the homepage template without dynamic data
    res.render('homepage', {
      // You can still pass the logged_in status if your layout requires it
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


// router.get('/project/:id', async (req, res) => {
//   try {
//     const projectData = await Project.findByPk(req.params.id, {
//       include: [
//         {
//           model: User,
//           attributes: ['name'],
//         },
//       ],
//     });

//     const project = projectData.get({ plain: true });

//     res.render('project', {
//       ...project,
//       logged_in: req.session.logged_in
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  console.log("** Inside profile route ***");
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
    });

    const user = userData.get({ plain: true });
    console.log("User is :" + JSON.stringify(user));

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



// router.post('/login', async (req, res) => {
//   try {
//     // Example: Find user by email
//     const userData = await User.findOne({ where: { email: req.body.email } });

//     if (!userData) {
//       res.status(400).json({ message: 'Incorrect email or password, please try again' });
//       return;
//     }

//     // Example: Check password
//     const validPassword = userData.checkPassword(req.body.password);

//     if (!validPassword) {
//       res.status(400).json({ message: 'Incorrect email or password, please try again' });
//       return;
//     }

//     // If login is successful, add the user ID to the session
//     req.session.save(() => {
//       req.session.user_id = userData.id; // Storing user ID in session
//       req.session.logged_in = true; // Marking the user as logged in

//       // Log session data for confirmation
//       console.log('Session Data:', req.session);

//       res.json({ user: userData, message: 'You are now logged in!' });
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// });



router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});


router.get('/signup', (req, res) => {


  res.render('signup');
});


router.get('/admin', (req, res) => {


  res.render('admin');
});

router.get('/search-results', (req, res) => {


  res.render('search-results');
});

module.exports = router;
