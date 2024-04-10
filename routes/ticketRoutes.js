const express = require('express');
const ticketController = require('../controllers/ticketController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.protect, ticketController.getAllTickets)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    ticketController.setProjectUserIds,
    ticketController.createTicket
  );

router
  .route('/:id')
  .get(ticketController.getTicket)
  .patch(ticketController.updateTicket)
  .delete(authController.protect, ticketController.deleteTicket);

module.exports = router;
