var express = require('express');
var router = express.Router();
const Book = require('../models').Book

/* Async Handler*/
function asyncHandler(cb) {
    return async(req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err) {
            next(err)
        }
    }
}

/* GET home page. */
router.get('/', async(req, res, next) => {
    // res.render('index', { title: 'Express' });
    const books = await Book.findAll()
    console.log(books.get({ plain: true }))
});

module.exports = router;