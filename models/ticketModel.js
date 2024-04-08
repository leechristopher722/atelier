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
      required: [true, 'A ticket must have an assigne e']
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

// DOCUMENT MIDDLEWARE: runs after .save() or .create() NOT FOR UPDATES
// ticketSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE: deals w/ queries not documents
ticketSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// AGGREGATION MDIDLEWARE: removing secret ticket in aggregation pipeline
ticketSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { isSecret: { $ne: true } } }); // Aggregation pipeline object (array)
  next();
});

const Ticket = mongoose.model('ticket', ticketSchema);

module.exports = Ticket;
