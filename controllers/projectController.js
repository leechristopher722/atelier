const Project = require('../models/projectModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllProjects = factory.getAll(Project);
exports.getProject = factory.getOne(Project, 'tickets');
exports.createProject = factory.createOne(Project);
exports.updateProject = factory.updateOne(Project);
exports.deleteProject = factory.deleteOne(Project);

exports.getAllProjectsForUser = catchAsync(async (req, res, next) => {
  // Aggregate pipeline to match projects where the user ID is in members.account
  const projects = await Project.aggregate([
    {
      $match: {
        'members.account': res.locals.user._id,
      },
    },
    {
      $project: {
        name: 1, // Include project name in the result
        summary: 1, // Include project summary in the result
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: projects,
    },
  });
});

exports.getProjectStats = catchAsync(async (req, res, next) => {
  const stats = await Project.aggregate([
    // Aggregation Pipleline operates in order. Order matters. Use var names as defined in previous pipeline steps.
    {
      $match: { price: { $lt: 80 } },
    },
    {
      $group: {
        _id: { $toUpper: '$name' }, // Can group by any field (ex. Difficulty easy, medium, hard, etc)
        numProjects: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    {
      $match: { _id: { $ne: 'TEST PROJECT WITH PRICE2' } },
    },
    // Possible useful functions: $unwind, $month, $push, and more on MongoDB Aggregation pipeline operators document
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
