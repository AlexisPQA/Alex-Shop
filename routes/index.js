var express = require('express');
var router = express.Router();
const indexController = require('../controllers/index.controller')
/* GET home page. */
router.get('/', indexController.index);

module.exports = router;
