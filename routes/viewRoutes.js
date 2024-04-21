const express = require('express');
const viewController = require('../controllers/viewController');
const router = express.Router();

router.get('/', viewController.getProjects);
router.get('/projects/:slug', viewController.getProject);
router.get('/projects/:slug/tickets', viewController.getProjectTickets);

module.exports = router;
