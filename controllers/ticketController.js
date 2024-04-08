const Ticket = require('./../models/ticketModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllTickets = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Ticket.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tickets = await features.query;

  res.status(200).json({
    status: 'success',
    user: req.user,
    requestedAt: req.requestTime,
    results: tickets.length,
    data: {
      tickets
    }
  });
});

exports.getTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(new AppError('No ticket found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      ticket
    }
  });
});

exports.createTicket = catchAsync(async (req, res, next) => {
  const newTicket = await Ticket.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      ticket: newTicket
    }
  });
});

exports.updateTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!ticket) {
    return next(new AppError('No ticket found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      ticket
    }
  });
});

exports.deleteTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findByIdAndDelete(req.params.id);

  if (!ticket) {
    return next(new AppError('No ticket found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
