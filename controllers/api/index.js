const router = require('express').Router();
const userRoutes = require('./userRoutes');
const whiskyRoutes = require('./whiskyRoutes');
const ratingRoutes = require('./ratingRoutes');


router.use('/users', userRoutes);
router.use('/whiskeys', whiskyRoutes);
router.use('/ratings', ratingRoutes);

module.exports = router;
