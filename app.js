var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const models = require('./models')

var indexRouter = require('./routes/index');
var books = require('./routes/books');

var app = express();

(async() => {
    await models.sequelize.sync();
    try {
        await models.sequelize.authenticate();
        // console.log(book.toJSON());
        console.log('Connection to the database is established')
    } catch (err) {
        console.log('Error connecting to the database: ', err)
    }
})()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', books);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error();
    err.message = 'Page not Found';
    err.status = 404;
    console.log('Error Page not found')
    res.render('books/page-not-found', { err });
    next();
});

// error handler
app.use(function(err, req, res, next) {

    res.locals.error = err;
    if (!err.status) {
        err.status = 500;
        err.message = 'Server Error';

        console.log('Server error')
        console.log(err.status, err.message);

        res.render('error', { err })
    } else {
        res.status(err.status || 500)
        res.render('error', { err });
    }

});

module.exports = app;