const Comment = require('./../models/commentModel');
const factory = require('./handlerFactory');

exports.getAllComments = factory.getAll(Comment);
exports.getComment = factory.getOne(Comment);
exports.createComment = factory.createOne(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);

exports.setTicketUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.ticket) req.body.ticket = req.params.ticketId;
  if (!req.body.createdBy) req.body.createdBy = req.user.id;

  next();
};
