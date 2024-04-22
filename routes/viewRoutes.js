const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewController.getProjects);
router.get('/projects/:slug', viewController.getProject);
router.get('/projects/:slug/tickets', viewController.getProjectTickets);

router.get('/login', viewController.getLoginForm);
router.get('/logout', viewController.logout);

module.exports = router;
