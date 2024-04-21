const { trusted } = require('mongoose');
const Project = require('../models/projectModel');
const catchAsync = require('../utils/catchAsync');

exports.getProjects = catchAsync(async (req, res) => {
  const projects = await Project.find();

  res.status(200).render('pages/index', {
    title: 'Workspace for Developers',
    projects: projects.map(project => project.toJSON())
  });
});

exports.getProject = catchAsync(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug }).populate({
    path: 'tickets',
    fields: 'name asignee createdAt'
  });

  const projects = await Project.find();

  res.status(200).render('pages/project/overview', {
    title: `${project.name}`,
    projects: projects.map(project => project.toJSON()),
    project: project.toJSON(),
    isOverviewPage: 'active'
  });
});

exports.getProjectTickets = catchAsync(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug }).populate({
    path: 'tickets'
  });

  const projects = await Project.find();

  res.status(200).render('pages/project/tickets', {
    projects: projects.map(project => project.toJSON()),
    project: project.toJSON(),
    isTicketsPage: 'active'
  });
});
