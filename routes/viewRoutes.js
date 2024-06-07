const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/reset-password', viewController.getResetPasswordForm);

router.use(authController.isLoggedIn);

router.get('/login', viewController.getLoginForm);
router.get('/signup', viewController.getSignupForm);
// TODO: Implement reset forgot password
// router.get('/new-password/:token', viewController.getNewPasswordForm);

router.get('/me', authController.protect, viewController.getAccount);

// TODO:Implement GET ALL PROJECTS FOR ADMIN
router.get('/', viewController.redirectToLogin, viewController.getUserProjects);
router.get(
  '/projects/:projectSlug',
  viewController.redirectToLogin,
  viewController.getProject,
);
router.get(
  '/projects/:projectSlug/tickets',
  viewController.redirectToLogin,
  viewController.getProjectTickets,
);
router.get(
  '/projects/:projectSlug/members',
  viewController.redirectToLogin,
  viewController.getProjectMembers,
);
router.get(
  '/projects/:projectSlug/settings',
  viewController.redirectToLogin,
  viewController.getProjectSettings,
);

module.exports = router;
