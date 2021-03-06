const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./app');

const AppError = require('./utils/appError');


process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Database connected sucessfully...');
  });

//Handling unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Could not find ${req.originalUrl} on this server.`, 404));
  res.status(404).send(`Could not find ${req.originalUrl} on this server.`)
});
//Server
const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  console.log(`Server started on port ${port}.... `);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
