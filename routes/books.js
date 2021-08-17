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
router.get('/', asyncHandler(async(req, res) => {
    const books = await Book.findAll({
            order: [
                ['title', 'ASC']
            ]
        })
        // console.log(books.map((book) => book.toJSON()));

    res.render('index', { books });
}));

router.get('/new', (req, res) => {
    res.render('books/new-book', { book: {}, error: false, title: "Create a New Book entry" })
})

router.post('/new', asyncHandler(async(req, res) => {
    let book;
    try {
        // console.log(req.body)
        book = await Book.create(req.body)
        res.redirect('/books')
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            book = await Book.build(req.body)
            res.render('books/new-book', { book, error: err.errors, title: 'Create a New Book entry' })
        } else {
            throw err
        }
    }
}))

router.get('/:id', asyncHandler(async(req, res) => {
    const book = await Book.findByPk(req.params.id)
        // console.log(book.toJSON())
    res.render('books/update-book', { book, error: false })
}))

router.post('/:id', asyncHandler(async(req, res, next) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id)
        if (book) {
            await book.update(req.body)
            res.redirect('/books')
        } else next();
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            book = await Book.build(req.body)
            res.render('books/update-book', { book, error: err.errors })
        } else throw err
    }
}))

router.get('/:id/delete', asyncHandler(async(req, res) => {
    const book = await Book.findByPk(req.params.id)
    res.render('books/delete-book', { book })
}))

router.post('/:id/delete', asyncHandler(async(req, res) => {
    let book = await Book.findByPk(req.params.id)
    await book.destroy();
    res.redirect('/books');
}))

module.exports = router;