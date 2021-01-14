var express = require('express');
var router = express.Router();
const cartController = require('../controllers/Cart.controller')
/* GET users listing. */
router.get('/', cartController.index);
router.get('/add-to-cart/:id', cartController.AddProduct);
router.get('/remove-from-cart/:id', cartController.RemoveProduct);
router.post('/update-cart', cartController.update);
module.exports = router;
