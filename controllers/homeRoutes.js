const router = require('express').Router();
const { User, Admin, Rating, Whisky } = require('../models');
const withAuth = require('../utils/auth');
require('dotenv').config();


router.get('/', (req, res) => {
  try {
    res.render('homepage', {
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all whiskeys news
router.get('/news', async (req, res) => {
  console.log("** Getting  NEWS");
  try{
    const NewsAPI = require('newsapi');
    const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
    date = new Date()
    date.setMonth(date.getMonth() - 1);
     // To query /v2/top-headlines
    // All options passed to topHeadlines are optional, but you need to include at least one of them
    newsapi.v2.everything({
      //sources: 'bbc-news,the-verge',
      q: 'whiskey',
      searchIn: 'title',
      language: 'en',
      sortBy: 'relevancy',
      from: date
    }).then(response => {
       console.log(JSON.stringify(response));
       //let news = JSON.stringify(response);
       console.log(response.status);
       console.log("**RENDERING NEWS");
       return res.render('news',{
        data: response,
        logged_in: true,

       });
    })
    
  }
    catch (error) {
      console.log(error);
      res.status(500).send("Error retrieving whisky news ");
    }
  
})

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
  console.log("** Inside profile route ***" + JSON.stringify(req.session));
  try {
    // Find the logged in user based on the session ID
    let whiskeyRatingsData;
    let ratings;
    let userData;
    if (req.session.isAdmin) {
      userData = await Admin.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
      })
    }
    else {
      userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
      })
      whiskeyRatingsData = await Rating.findAll({
        where: { user_id: userData.id },
        // This will retrieve every ratings associated Whisky data.  
        include: [{ model: Whisky }],
      });
      console.log("Rating With Whiskey Name" + JSON.stringify(whiskeyRatingsData));
      ratings = whiskeyRatingsData.map((rating) =>
        rating.get({ plain: true }))
      console.log(ratings)
    };


    const user = userData.get({ plain: true });
    console.log("User is :" + JSON.stringify(user));

    if (req.session.isAdmin) {
      res.render('admin', {
        ...user,
        logged_in: true
      });
    }
    else {
      res.render('profile', {
        ...user,
        ratings,
        // comment: whiskeyRatingsData[0].comment,
        logged_in: true
      });
    }
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
  const searchTerm = req.query.search;
  const userIdTerm = req.query.userId;
  console.log("Home Routes UserID"+ userIdTerm)
  res.render('search-results-whiskeys', {
    search: searchTerm,
    userId: userIdTerm,
    logged_in: true
  });
});


module.exports = router;
