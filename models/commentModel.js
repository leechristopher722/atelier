const mongoose = require('mongoose');
const Ticket = require('./ticketModel');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Comment must have a content'],
      trim: true,
      maxLength: [400, 'Comment cannot be longer than 400 characters'],
    },
    ticket: {
      type: mongoose.Schema.ObjectId,
      ref: 'Ticket',
      required: [true, 'A comment must have a ticket'],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A comment must have a writer'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// DOCUMENT MIDDLEWARE: runs only before .save() or .create() NOT FOR UPDATES

// QUERY MIDDLEWARE: deals w/ queries not documents
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'createdBy',
    select: 'name photo',
  });

  this.sort({ createdAt: 1 });
  next();
});

commentSchema.statics.calcNumComments = async function (ticketId) {
  const stats = await this.aggregate([
    {
      $match: { ticket: ticketId },
    },
    {
      $group: {
        _id: '$ticket',
        nComment: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Ticket.findByIdAndUpdate(ticketId, {
      numComments: stats[0].nComment,
    });
  } else {
    await Ticket.findByIdAndUpdate(ticketId, {
      numComments: 0,
    });
  }
};

commentSchema.post(/save|^findOneAnd/, async (doc) => {
  if (doc) {
    await doc.constructor.calcNumComments(doc.ticket);
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
