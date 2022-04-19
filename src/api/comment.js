const express = require('express');
const CommentModel = require('../models/Comment');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { createdBy, content } = req.body;
    const comment = await CommentModel.create({ createdBy, content });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error });
  }
});
router.get('/all', async (req, res) => {
  try {
    const comments = await CommentModel.find({}).populate('createdBy');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await CommentModel.findById(id);
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await CommentModel.deleteOne({ _id: id });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error });
  }
});
module.exports = router;
