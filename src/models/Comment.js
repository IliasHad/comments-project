const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Content required'],
  },
  upvotes: [
    {
      createdBy: String,
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

const commentModel = model('Comment', commentSchema);

module.exports = commentModel;
