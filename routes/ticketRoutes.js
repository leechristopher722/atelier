const express = require('express');
const ticketController = require('../controllers/ticketController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, ticketController.getAllTickets)
  .post(ticketController.createTicket);

router
  .route('/:id')
  .get(ticketController.getTicket)
  .patch(ticketController.updateTicket)
  .delete(authController.protect, ticketController.deleteTicket);

module.exports = router;
