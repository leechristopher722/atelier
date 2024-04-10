const express = require('express');
const projectController = require('../controllers/projectController');
const authController = require('./../controllers/authController');
const ticketRouter = require('./ticketRoutes');

const router = express.Router();

// router.param('id', projectController.checkID); // MongoDB checks ID by default

router.use('/:projectId/tickets', ticketRouter);

router.route('/project-stats').get(projectController.getProjectStats);

router
  .route('/')
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(projectController.updateProject)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'project manager'),
    projectController.deleteProject
  );

module.exports = router;
