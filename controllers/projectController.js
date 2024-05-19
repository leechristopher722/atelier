const Project = require('./../models/projectModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const emailToId = require('./../utils/emailToId');

exports.getAllProjects = factory.getAll(Project);
exports.getProject = factory.getOne(Project, 'tickets');
exports.createProject = factory.createOne(Project);
exports.updateProject = factory.updateOne(Project);
exports.deleteProject = factory.deleteOne(Project);

exports.editMembers = catchAsync(async (req, res, next) => {
  if (req.body.addMembers || req.body.members) {
    const emails = req.body.addMembers ? req.body.addMembers : req.body.members;
    const toAdd = await emailToId(emails);
    if (toAdd[0] === 'None')
      return new AppError(`No user with that email: ${toAdd[1]}`, 404);
    req.body.$addToSet = { members: { $each: toAdd } };
    delete req.body.addMembers;
  }
  if (req.body.removeMembers) {
    const toRemove = await emailToId(req.body.removeMembers);
    if (toRemove[0] === 'None')
      return new AppError(`No user with that email: ${toRemove[1]}`, 404);
    req.body.$pull = { members: { $in: toRemove } };
    delete req.body.removeMembers;
  }
  next();
});

exports.getProjectStats = catchAsync(async (req, res, next) => {
  const stats = await Project.aggregate([
    // Aggregation Pipleline operates in order. Order matters. Use var names as defined in previous pipeline steps.
    {
      $match: { price: { $lt: 80 } }
    },
    {
      $group: {
        _id: { $toUpper: '$name' }, // Can group by any field (ex. Difficulty easy, medium, hard, etc)
        numProjects: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' }
      }
    },
    {
      $sort: {
        avgPrice: 1
      }
    },
    {
      $match: { _id: { $ne: 'TEST PROJECT WITH PRICE2' } }
    }
    // Possible useful functions: $unwind, $month, $push, and more on MongoDB Aggregation pipeline operators document
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});
