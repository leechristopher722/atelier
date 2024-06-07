const mongoose = require('mongoose');
const slugify = require('slugify');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A project must have a name'],
      unique: true,
      trim: true,
      maxLength: [
        30,
        'A project name must be less than or equal to 30 characters',
      ],
      minLength: [
        3,
        'A project name must be more than or equal to 3 characters',
      ],
      // External Library for validator
      // validate: [
      //   validator.isAlpha,
      //   'A project name must only contain alphabets'
      // ]
    },
    slug: String,
    summary: {
      type: String,
      trim: true,
      reuqired: [true, 'A project must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    members: [
      {
        account: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
        access: {
          type: String,
          enum: {
            values: ['Admin', 'Member', 'Viewer'],
            message: 'Member role is either: Administrator, Member, or Viewer',
          },
          default: 'Member',
        },
      },
    ],
    numTickets: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    isSecret: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: {
        values: ['Created', 'In Progress', 'Completed'],
        message: 'Project status is either: Created, In Progress, or Completed',
      },
      default: 'Created',
    },
  },
  {
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

projectSchema.index({ slug: 1 });

// Virtual Property: For simple data that does not need to be stored in the DB
// Separating business logic from the database in the model, and having little in controller.
projectSchema.virtual('createdAtClean').get(function () {
  return new Date(this.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
});

// Virtual populate
projectSchema.virtual('tickets', {
  ref: 'Ticket',
  foreignField: 'project',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: runs only before .save() or .create() NOT FOR UPDATES
projectSchema.pre('save', function (next) {
  // console.log(this); // Shows how data is stored to DB right before .save()
  this.slug = slugify(this.name, { lower: true });
  next();
});

// FOR EMBEDDING USERROLES
// projectSchema.pre('save', async function(next) {
//   const usersPromises = this.userRoles.map(async id => await User.findById(id));
//   this.userRoles = await Promise.all(usersPromises);
//   next();
// });

// QUERY MIDDLEWARE: deals w/ queries not documents
projectSchema.pre(/^find/, function (next) {
  // Works on all funciton that starts with find
  // projectSchema.pre('find', function(next) {
  this.find({ isSecret: { $ne: true } });
  this.sort({ createdAt: -1 });

  this.start = Date.now();
  next();
});

// Populate Members of the project with query middleware
projectSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'members.account',
    select: 'name photo email role',
  });
  next();
});

// AGGREGATION MDIDLEWARE: removing secret project in aggregation pipeline
projectSchema.pre('aggregate', function (next) {
  // Aggregation pipeline object (array)
  this.pipeline().unshift({ $match: { isSecret: { $ne: true } } });
  next();
});

// Editing project members
projectSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  if (update.addMembers) {
    this._update.$push = { members: { $each: update.addMembers } };
    delete this._update.addMembers;
  }

  if (update.removeMembers) {
    this._update.$pull = {
      members: { account: { $in: update.removeMembers } },
    };
    delete this._update.removeMembers;
  }

  if (update.updateMemberAccess) {
    const userId = update.updateMemberAccess.account;
    const newAccess = update.updateMemberAccess.access;

    // Find the member and update the access
    this._update = {
      $set: {
        'members.$[elem].access': newAccess,
      },
    };

    // Use arrayFilters to specify which array element to update
    this.options.arrayFilters = [{ 'elem.account': userId }];

    // Remove the custom updateMemberAccess field to prevent it from being applied directly
    delete this._update.updateMemberAccess;
  }

  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
