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
        40,
        'A project name must be less than or equal to 40 characters'
      ],
      minLength: [
        10,
        'A project name must be more than or equal to 10 characters'
      ]
      // External Library for validator
      // validate: [
      //   validator.isAlpha,
      //   'A project name must only contain alphabets'
      // ]
    },
    slug: String,
    summary: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    numTickets: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    // price: {
    //   type: Number,
    //   min: [0, 'Price must be greater than or equal to 0'],
    //   max: [1000, 'Price must be less than or equal to 1000']
    // },
    // priceDiscount: {
    //   type: Number,
    //   validate: {
    //     // Custom validators: there is validators npm library on github preBuilt
    //     validator: function(val) {
    //       // Will not work on update *******IMPORTANT**********
    //       // this only points to current doc on NEW document creation
    //       return val < this.price;
    //     },
    //     message: 'Discount price {VALUE} should be less than regular price'
    //   }
    // },
    isSecret: {
      type: Boolean,
      default: false
    },
    difficulty: {
      type: String,
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty is either: easy, medium, hard'
      }
    }
  },
  {
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

projectSchema.index({ slug: 1 });

// Virtual Property: For simple data that does not need to be stored in the DB
// Separating business logic from the database in the model, and having little in controller.
projectSchema.virtual('createdAtClean').get(function() {
  return new Date(this.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

// Virtual populate
projectSchema.virtual('tickets', {
  ref: 'Ticket',
  foreignField: 'project',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs only before .save() or .create() NOT FOR UPDATES
projectSchema.pre('save', function(next) {
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

// DOCUMENT MIDDLEWARE: runs after .save() or .create() NOT FOR UPDATES
// projectSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE: deals w/ queries not documents
projectSchema.pre(/^find/, function(next) {
  // Works on all funciton that starts with find
  // projectSchema.pre('find', function(next) {
  this.find({ isSecret: { $ne: true } });

  this.start = Date.now();
  next();
});

// Populate Members of the project with query middleware
projectSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'members',
    select: '-__v -passwordChangedAt'
  });
  next();
});

projectSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// AGGREGATION MDIDLEWARE: removing secret project in aggregation pipeline
projectSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { isSecret: { $ne: true } } }); // Aggregation pipeline object (array)
  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
