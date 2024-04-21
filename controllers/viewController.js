const Project = require('../models/projectModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  const projects = await Project.find();

  res.status(200).render('index', {
    projects
  });
});

exports.getProject = (req, res) => {
  res.status(200).render('project', {
    project:
      'THISISISISISISISISIISI YEAAEAHAAHAHHHH ABABY BABY LEETS FUCKING GO'
  });
};
