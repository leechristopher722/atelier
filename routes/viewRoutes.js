const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/login', viewController.getLoginForm);
router.get('/signup', viewController.getSignupForm);
router.get('/reset-password', viewController.getResetPasswordForm);
// TODO: Implement reset forgot password
// router.get('/new-password/:token', viewController.getNewPasswordForm);

router.get('/me', authController.protect, viewController.getAccount);

router.get('/', viewController.redirectToLogin, viewController.getProjects);
router.get(
  '/projects/:projectSlug',
  viewController.redirectToLogin,
  viewController.getProject
);
router.get(
  '/projects/:projectSlug/tickets',
  viewController.redirectToLogin,
  viewController.getProjectTickets
);

module.exports = router;
