var express = require('express');
var router = express.Router();
const product = require('../controllers/Product.controller'); 
/* GET product page. */
router.get('/', product.index);
router.get('/book', product.index);
router.get('/book/:id', product.detail);
module.exports = router;