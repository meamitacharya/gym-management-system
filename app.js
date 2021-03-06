const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//Initialising express app

const globalErrorHandler = require('./controller/errorController');
const userRouter = require('./routes/userRoutes');
const gymrouter = require('./routes/gymRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

//Setting View Engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global Middlewares
app.use(cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Set security HTTP headers
app.use(helmet());

//Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//To restrict too many requests from single IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again latter.'
});
app.use('/api/', limiter);

//Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS(Cross Site Scripting)
app.use(xss());

//Routes

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Acess-Control-Allow-Headers',
//     'Origin',
//     'X-Requested-With',
//     'Accept',
//     'Authorization'
//   );
//   next();
// });

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/gyms', gymrouter);


//Error handling middleware
app.use(globalErrorHandler);


module.exports = app;
