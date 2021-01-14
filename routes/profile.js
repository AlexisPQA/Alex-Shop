var express = require('express')
var router = express.Router()
const profileController = require('../controllers/profile.controller')
const checkAuth = require('../config/checkAuth')

router.get('/', checkAuth.ensureAuthenticated,profileController.index)

module.exports = router;