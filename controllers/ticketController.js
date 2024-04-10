const Ticket = require('./../models/ticketModel');
const factory = require('./handlerFactory');
// const catchAsync = require('./../utils/catchAsync');

exports.getAllTickets = factory.getAll(Ticket);
exports.getTicket = factory.getOne(Ticket);
exports.createTicket = factory.createOne(Ticket);
exports.updateTicket = factory.updateOne(Ticket);
exports.deleteTicket = factory.deleteOne(Ticket);

exports.setProjectUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.project) req.body.project = req.params.projectId;
  if (!req.body.assignee) req.body.assignee = req.user.id;

  next();
};
