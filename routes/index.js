var express = require('express');
var router = express.Router();

/* GET / Redirect to books route */
router.get('/', function(req, res, next) {
    res.redirect('/books');
});

module.exports = router;