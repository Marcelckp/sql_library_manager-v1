var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const Sequelize = require('../models').Sequelize
const Op = Sequelize.Op

/* Async Handler*/
function asyncHandler(cb) {
    return async(req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err) {
            console.log(err);
            next(err)
        }
    }
}

async function showBook(term = '', page = 1) {
    let { rows, count } = await Book.findAndCountAll({
        where: {
            [Op.or]: {
                title: {
                    [Op.like]: `%${term}%`
                },
                author: {
                    [Op.like]: `%${term}%`
                },
                genre: {
                    [Op.like]: `%${term}%`
                },
                year: {
                    [Op.like]: `%${term}%`
                }
            }
        },
        order: [
            ['title', 'ASC']
        ],
        limit: 10,
        offset: page * 10 - 10
    })
    const bookPages = Math.ceil(count / 10)
        // console.log(rows.length, bookPages)
    return { bookPages, books: rows }
}

// Search Books
router.get('/search', asyncHandler(async(req, res) => {
    let term = req.query.term && req.query.term.toLowerCase() || '';
    // if (req.query.term) {
    //     term = req.query.term.toLowerCase();
    // } else {
    //     term = ''
    // }
    const page = req.query.page || 1;

    const { books, bookPages } = await showBook(term, page)
        // console.log(books.map(b => b.toJSON()))
    res.render('index', { books, bookPages, page, term })
}))

/* GET home page. */
router.get('/', asyncHandler(async(req, res) => {
    // const { rows, count } = await Book.findAndCountAll({
    //         order: [
    //             ['title', 'ASC']
    //         ],
    //         limit: 10,
    //         offset: 10 * (page - 1)
    //     })
    //     // console.log(books.map((book) => book.toJSON()));
    // const bookPages = Math.ceil(rows.length / count);
    const { books, bookPages } = await showBook()
    res.render('index', { books, bookPages, page: 1 });
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