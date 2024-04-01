const express = require('express');
const projectController = require('../controllers/projectController');
const authController = require('./../controllers/authController');

const router = express.Router();

// router.param('id', projectController.checkID); // MongoDB checks ID by default

router.route('/project-stats').get(projectController.getProjectStats);

router
  .route('/')
  .get(authController.protect, projectController.getAllProjects)
  .post(projectController.createProject);

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

module.exports = router;
