const mongoose = require('mongoose');
const slugify = require('slugify');
const Project = require('./projectModel');

const ticketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A ticket must have a name'],
      unique: true,
      trim: true,
      maxLength: [
        100,
        'A ticket name must be less than or equal to 100 characters'
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
    category: {
      type: String,
      enum: {
        values: ['dev', 'design', 'user experience'],
        message: 'Ticket categories are either: dev, design, user experience'
      },
      required: [true, 'A ticket must have a category']
    },
    description: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    status: {
      type: String,
      enum: {
        values: ['created', 'in progress', 'completed'],
        message: 'Ticket status is either: created, in progress, or completed'
      },
      default: 'created'
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

// TODO: Implement indexing for tickets for imporved read performance
// ticketSchema.index({ project: 1, ... });

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

ticketSchema.statics.calcNumTickets = async function(projectId) {
  const stats = await this.aggregate([
    {
      $match: { project: projectId }
    },
    {
      $group: {
        _id: '$project',
        nTicket: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Project.findByIdAndUpdate(projectId, {
      numTickets: stats[0].nTicket
    });
  } else {
    await Project.findByIdAndUpdate(projectId, {
      numTickets: 0
    });
  }
};

ticketSchema.post(/save|^findOneAnd/, async doc => {
  if (doc) {
    await doc.constructor.calcNumTickets(doc.project);
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
