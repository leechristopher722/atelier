const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const projectRouter = require('./routes/projectRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) Middlewares - order matters a lot
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

// 3) Routes
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // Argument passed into next() is always an error
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
