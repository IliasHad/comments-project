const express = require('express');
const CommentModel = require('../models/Comment');

const router = express.Router();

router.post('/:commentId', async (req, res) => {
  try {
    const { createdBy } = req.body;
    const { commentId } = req.params;
    const isExists = await CommentModel.findOne({
      _id: commentId,
      'upvotes.createdBy': createdBy,
    });
    if (isExists) {
      const comment = await CommentModel.findOneAndUpdate(
        { _id: commentId },
        { $pull: { upvotes: { createdBy } } },
        {
          new: true,
          runValidators: true,
          context: 'query',
        }
      ).populate('createdBy').populate({
        path: 'replies',
        populate: { path: 'createdBy' }
      });
      res.json(comment);
    } else {
      const comment = await CommentModel.findOneAndUpdate(
        { _id: commentId },
        { $push: { upvotes: { createdBy } } },
        {
          new: true,
          runValidators: true,
          context: 'query',
        }
      ).populate('createdBy').populate({
        path: 'replies',
        populate: { path: 'createdBy' }
      });
      res.json(comment);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
