const Project = require('./../models/projectModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.getAllProjects = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Project.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const projects = await features.query;

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: projects.length,
    data: {
      projects
    }
  });
});

exports.getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  // Project.findOne({ _id: req.params.id}) -> same thing as above

  res.status(200).json({
    status: 'success',
    data: {
      project
    }
  });
});

exports.createProject = catchAsync(async (req, res, next) => {
  const newProject = await Project.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      project: newProject
    }
  });
});

exports.updateProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      project
    }
  });
});

exports.deleteProject = catchAsync(async (req, res, next) => {
  await Project.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
  res.status(404).json({
    status: 'fail',
    message: err
  });
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
  res.status(404).json({
    status: 'fail',
    message: err
  });
});