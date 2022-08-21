var express = require('express');
const {route} = require('../app');
const book = require('../models/book');
var router = express.Router();
var Book = require("../models").Book;

/* GET home page. */
router.get('/', async(req, res, next) => {
  res.redirect("/books");
});

module.exports = router;