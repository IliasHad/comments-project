const express = require('express');
const CommentModel = require('../models/Comment');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { createdBy, content } = req.body;

    const comment = new CommentModel({ createdBy, content });
    comment.save(() => {
      comment.populate('createdBy', (err, doc) => {
        res.json(doc);
      });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});
router.get('/all', async (req, res) => {
  try {
    const comments = await CommentModel.find({})
      .populate('createdBy')
      .populate({
        path: 'replies',
        populate: { path: 'createdBy' },
      });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await CommentModel.findById(id)
      .populate('createdBy')
      .populate({
        path: 'replies',
        populate: { path: 'createdBy' },
      });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { createdBy, content } = req.body;
    const { id: replyId } = await CommentModel.create({ createdBy, content });
    const comment = await CommentModel.findByIdAndUpdate(
      id,
      {
        $push: { replies: replyId },
      },
      {
        new: true,
        runValidators: true,
        context: 'query',
      }
    )
      .populate('createdBy')
      .populate({
        path: 'replies',
        populate: { path: 'createdBy' },
      });
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
