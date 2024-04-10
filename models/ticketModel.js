const mongoose = require('mongoose');
const slugify = require('slugify');

const ticketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A ticket must have a name'],
      unique: true,
      trim: true,
      maxLength: [
        40,
        'A ticket name must be less than or equal to 40 characters'
      ],
      minLength: [
        10,
        'A ticket name must be more than or equal to 10 characters'
      ]
    },
    slug: String,
    project: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
      required: [true, 'A ticket must have a project']
    },
    assignee: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A ticket must have an assignee']
    },
    type: String,
    description: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    difficulty: {
      type: String,
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty is either: easy, medium, hard'
      }
    },
    comments: {
      type: String
    }
  },
  {
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// DOCUMENT MIDDLEWARE: runs only before .save() or .create() NOT FOR UPDATES
ticketSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE: deals w/ queries not documents
ticketSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'assignee',
    select: 'name'
  });
  // .populate({
  //   path: 'project',
  //   select: '-members name'
  // });
  next();
});

ticketSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
