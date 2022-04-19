const express = require('express');

const comment = require('./comment');
const upvote = require('./upvote');
const user = require('./user');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/comment', comment);
router.use('/upvote', upvote);
router.use('/user', user);

module.exports = router;
