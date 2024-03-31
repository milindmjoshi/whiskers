const router = require('express').Router();
const userRoutes = require('./userRoutes');
const whiskyRoutes = require('./whiskyRoutes');

router.use('/users', userRoutes);
router.use('/whiskies', whiskyRoutes);

module.exports = router;
