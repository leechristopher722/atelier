const multer = require('multer');
const fs = require('fs');
const Project = require('../models/projectModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllProjects = factory.getAll(Project);
exports.getProject = factory.getOne(Project, 'tickets');
exports.createProject = factory.createOne(Project);
exports.updateProject = factory.updateOne(Project);
exports.deleteProject = factory.deleteOne(Project);

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype === 'image/svg+xml') {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only SVG files.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadLogo = upload.single('logo');

exports.processLogo = catchAsync(async (req, res, next) => {
  if (!req.file) {
    if (req.body.logo) {
      req.file = { filename: req.body.logo };
    }
    return next();
  }

  req.file.filename = `project-${req.params.id}-${Date.now()}.svg`;
  req.body.logo = req.file.filename;

  fs.writeFile(
    `public/assets/media/projects/${req.file.filename}`,
    req.file.buffer,
    (err) => {
      if (err) {
        return next(new AppError('Error saving the file', 500));
      }
      next();
    },
  );
});

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

exports.parseMembers = (req, res, next) => {
  if (req.body.members) {
    req.body.members = JSON.parse(req.body.members);
  }
  next();
};

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
