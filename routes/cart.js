var express = require('express');
var router = express.Router();
const cartController = require('../controllers/Cart.controller')
const checkAuth = require('../config/checkAuth')
/* GET users listing. */
router.get('/', cartController.index);
router.get('/add-to-cart/:id', cartController.AddProduct);
router.get('/remove-from-cart/:id', cartController.RemoveProduct);
router.post('/update-cart', cartController.update);
router.get('/purchase', checkAuth.ensureAuthenticated, cartController.purchase);
router.get('/buyed', checkAuth.ensureAuthenticated, cartController.buyed);
module.exports = router;
