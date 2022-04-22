const express = require('express');
const UserModel = require('../models/User');

const router = express.Router();

router.get('/random/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findOne({ _id: { $ne: id } });
    res.json({ user, random: true });
  } catch (error) {
    res.status(500).json({ error });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (id !== 'undefined' && id !== 'null') {
      const user = await UserModel.findById(id);
      // send info about requested user id
      res.json(user);
    } else {
      const { _doc: random } = await UserModel.findOne({});

      // send info about random user when user id is not valid
      res.json({ ...random, random: true });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
