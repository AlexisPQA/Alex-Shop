var express = require('express');
var router = express.Router();
const product = require('../controllers/Product.controller'); 
/* GET product page. */
router.get('/', function(req, res, next) {
  res.render('products');
  
});
router.get('/', book.index);

module.exports = router;