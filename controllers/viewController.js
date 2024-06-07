const Project = require('../models/projectModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllProjects = catchAsync(async (req, res) => {
  const projects = await Project.find();

  res.status(200).render('pages/index', {
    title: 'Workspace for Developers',
    projects,
  });
});

exports.getUserProjects = catchAsync(async (req, res) => {
  const projects = await Project.aggregate([
    {
      $match: {
        'members.account': res.locals.user._id,
      },
    },
  ]);

  res.status(200).render('pages/index', {
    title: 'Workspace for Developers',
    projects,
  });
});

exports.getProject = catchAsync(async (req, res) => {
  const project = await Project.findOne({
    slug: req.params.projectSlug,
  }).populate({
    path: 'tickets',
  });

  const groupedTickets = Object.groupBy(
    project.tickets,
    ({ status }) => status,
  );

  if (!groupedTickets.created) {
    groupedTickets.created = [];
  }

  if (!groupedTickets.in_progress) {
    groupedTickets.in_progress = [];
  }

  if (!groupedTickets.completed) {
    groupedTickets.completed = [];
  }

  const projects = await Project.aggregate([
    {
      $match: {
        'members.account': res.locals.user._id,
      },
    },
    {
      $project: {
        name: 1,
        slug: 1,
      },
    },
  ]);

  res.status(200).render('pages/project/overview', {
    title: `${project.name}`,
    projects,
    project,
    groupedTickets,
    isOverviewPage: 'active',
  });
});

exports.getProjectTickets = catchAsync(async (req, res) => {
  const project = await Project.findOne({
    slug: req.params.projectSlug,
  }).populate({
    path: 'tickets',
  });

  const groupedTickets = Object.groupBy(
    project.tickets,
    ({ status }) => status,
  );

  if (!groupedTickets.created) {
    groupedTickets.created = [];
  }

  if (!groupedTickets.in_progress) {
    groupedTickets.in_progress = [];
  }

  if (!groupedTickets.completed) {
    groupedTickets.completed = [];
  }

  const projects = await Project.aggregate([
    {
      $match: {
        'members.account': res.locals.user._id,
      },
    },
    {
      $project: {
        name: 1,
        slug: 1,
      },
    },
  ]);

  res.status(200).render('pages/project/tickets', {
    title: `${project.name}`,
    projects,
    project,
    groupedTickets,
    isTicketsPage: 'active',
  });
});

exports.getProjectMembers = catchAsync(async (req, res) => {
  const project = await Project.findOne({
    slug: req.params.projectSlug,
  });

  const projects = await Project.aggregate([
    {
      $match: {
        'members.account': res.locals.user._id,
      },
    },
    {
      $project: {
        name: 1,
        slug: 1,
      },
    },
  ]);

  res.status(200).render('pages/project/members', {
    title: `${project.name}`,
    projects,
    project,
    isMembersPage: 'active',
  });
});

exports.getProjectSettings = catchAsync(async (req, res) => {
  const project = await Project.findOne({
    slug: req.params.projectSlug,
  });

  const projects = await Project.aggregate([
    {
      $match: {
        'members.account': res.locals.user._id,
      },
    },
    {
      $project: {
        name: 1,
        slug: 1,
      },
    },
  ]);

  res.status(200).render('pages/project/settings', {
    title: `${project.name}`,
    projects,
    project,
    isSettingsPage: 'active',
  });
});

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
  const projects = await Project.aggregate([
    {
      $match: {
        'members.account': res.locals.user._id,
      },
    },
    {
      $project: {
        name: 1,
        slug: 1,
      },
    },
  ]);
  res.status(200).render('pages/account', {
    title: 'My Account',
    projects,
  });
});
