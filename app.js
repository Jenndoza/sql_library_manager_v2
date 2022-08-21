var sequelize = require("./models/index.js").sequelize;
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var booksRouter = require("./routes/books");
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);

// Testing database connection & syncing with the model
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection failed");
  }
  try {
    await sequelize.sync();
    console.log("Synced with database");
  } catch (error) {
    console.error("Snyced error with database");
  }
})();


// 404 not found error handler
app.use((req, res, next) => {
  const error = new Error();
  error.status = 404;
  error.message = `The page you are requesting doesn't exist`;
  console.log(error);
  next(error);
});

// Global Error Handler
app.use((err, req, res, next) => {
  const error = new Error();
  error.status = err.status || 500;
  error.message =
    err.message || "Internal Server Error";
  // render the error page
  res.status(err.status || 500);
  res.render("error", { error });
});

module.exports = app;
