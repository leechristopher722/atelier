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

  res.status(200).render('pages/overview', {
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

  res.status(200).render('pages/tickets', {
    title: `${project.name}`,
    projects: projects.map(project => project.toJSON()),
    project: project.toJSON(),
    isTicketsPage: 'active'
  });
});

exports.getLoginForm = (req, res) => {
  if (res.locals.user) {
    return res.redirect('/');
  }
  res.status(200).render('pages/login', {
    title: 'Login to your account'
  });
};

exports.getSignupForm = (req, res) => {
  if (res.locals.user) {
    return res.redirect('/');
  }
  res.status(200).render('pages/signup', {
    title: 'Create new account'
  });
};

exports.getResetPasswordForm = (req, res) => {
  res.status(200).render('pages/reset-password', {
    title: 'Reset Password'
  });
};

exports.getNewPasswordForm = (req, res) => {
  res.status(200).render('pages/new-password', {
    title: 'New Password'
  });
};

exports.redirectToLogin = (req, res, next) => {
  if (!res.locals.user) {
    res.redirect('/login');
  }
  next();
};
