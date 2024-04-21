const express = require('express');
const viewController = require('../controllers/viewController');
const router = express.Router();

router.get('/', viewController.getOverview);

router.get('/project', viewController.getProject);

module.exports = router;
