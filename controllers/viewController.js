const Project = require('../models/projectModel');
const catchAsync = require('../utils/catchAsync');

// For admin to view all projects
exports.getAllProjects = catchAsync(async (req, res) => {
  const projects = await Project.find();

  res.status(200).render('pages/index', {
    title: 'Workspace for Developers',
    projects,
  });
});

exports.getUserProjects = catchAsync(async (req, res) => {
  const projects = await Project.find({
    'members.account': res.locals.user._id,
  });

  const recentProjects = req.cookies.recentProjects
    ? JSON.parse(req.cookies.recentProjects)
    : [];

  res.status(200).render('pages/index', {
    title: 'Workspace for Developers',
    projects,
    recentProjects,
  });
});

exports.getProject = catchAsync(async (req, res) => {
  const project = await Project.findOne({
    slug: req.params.projectSlug,
  }).populate({
    path: 'tickets',
  });

  const recentProjects = req.cookies.recentProjects
    ? JSON.parse(req.cookies.recentProjects)
    : [];

  res.status(200).render('pages/project/overview', {
    title: `${project.name}`,
    project,
    recentProjects,
    isOverviewPage: 'active',
  });
});

exports.getProjectTickets = catchAsync(async (req, res) => {
  const project = await Project.findOne({
    slug: req.params.projectSlug,
  }).populate({
    path: 'tickets',
  });

  const recentProjects = req.cookies.recentProjects
    ? JSON.parse(req.cookies.recentProjects)
    : [];

  res.status(200).render('pages/project/tickets', {
    title: `${project.name}`,
    project,
    recentProjects,
    isTicketsPage: 'active',
  });
});

exports.getProjectMembers = catchAsync(async (req, res) => {
  const project = await Project.findOne({
    slug: req.params.projectSlug,
  });

  const recentProjects = req.cookies.recentProjects
    ? JSON.parse(req.cookies.recentProjects)
    : [];

  res.status(200).render('pages/project/members', {
    title: `${project.name}`,
    project,
    recentProjects,
    isMembersPage: 'active',
  });
});

exports.getProjectSettings = catchAsync(async (req, res) => {
  const project = await Project.findOne({
    slug: req.params.projectSlug,
  });

  const recentProjects = req.cookies.recentProjects
    ? JSON.parse(req.cookies.recentProjects)
    : [];

  res.status(200).render('pages/project/settings', {
    title: `${project.name}`,
    project,
    recentProjects,
    isSettingsPage: 'active',
  });
});

exports.updateRecentProjects = async (req, res, next) => {
  let recentProjects = req.cookies.recentProjects
    ? JSON.parse(req.cookies.recentProjects)
    : [];

  // Fetch user's projects if recentProjects is empty
  if (recentProjects.length === 0) {
    const userProjects = await Project.find({
      'members.account': res.locals.user._id,
    })
      .limit(3)
      .select('slug name');
    recentProjects = userProjects.map((project) => ({
      name: project.name,
      slug: project.slug,
    }));
  }

  const { projectSlug } = req.params;
  if (projectSlug) {
    const project = await Project.findOne({ slug: projectSlug });
    // Remove the project if it already exists in the list
    recentProjects = recentProjects.filter(
      (recents) => recents.slug !== projectSlug,
    );

    // Add the new project at the beginning of the list
    recentProjects.unshift({ name: project.name, slug: project.slug });
  }

  // Keep only the three most recent projects
  if (recentProjects.length > 3) {
    recentProjects = recentProjects.slice(0, 3);
  }

  // Update the cookie
  res.cookie('recentProjects', JSON.stringify(recentProjects), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  next();
};

exports.getLoginForm = (req, res) => {
  if (res.locals.user) {
    return res.redirect('/');
  }
  res.status(200).render('pages/login', {
    title: 'Login to your account',
  });
};

exports.getSignupForm = (req, res) => {
  if (res.locals.user) {
    return res.redirect('/');
  }
  res.status(200).render('pages/signup', {
    title: 'Create new account',
  });
};

exports.getResetPasswordForm = (req, res) => {
  res.status(200).render('pages/reset-password', {
    title: 'Reset Password',
  });
};

exports.getNewPasswordForm = (req, res) => {
  res.status(200).render('pages/new-password', {
    title: 'New Password',
  });
};

exports.redirectToLogin = (req, res, next) => {
  if (!res.locals.user) {
    res.redirect('/login');
  }
  next();
};

exports.getAccount = catchAsync(async (req, res) => {
  const projects = await Project.find({
    'members.account': res.locals.user._id,
  });

  res.status(200).render('pages/account', {
    title: 'My Account',
    projects,
  });
});
