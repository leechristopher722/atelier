const express = require('express');
const ticketController = require('../controllers/ticketController');
const authController = require('./../controllers/authController');
const commentRouter = require('./commentRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:ticketId/comments', commentRouter);

router.use(authController.protect);

router
  .route('/')
  .get(ticketController.getAllTickets)
  .post(ticketController.setProjectUserIds, ticketController.createTicket);

router
  .route('/:id')
  .get(ticketController.getTicket)
  .patch(ticketController.updateTicket)
  .delete(authController.protect, ticketController.deleteTicket);

module.exports = router;
