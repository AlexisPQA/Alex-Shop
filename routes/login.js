var express = require('express');
var router = express.Router();

var User = require('../models/user.model');
const authController = require('../controllers/Auth.controller')
const checkAuth = require('../config/checkAuth')

router.get('/', checkAuth.forwardAuthenticated, function(req, res, next) {
    res.render('Login',{error_msg:req.flash('error'),success_msg:req.flash('success_msg')});
  });
  
  router.get('/forgot', (req, res) => res.render('forgot'));

  //------------ Reset Password Route ------------//
  router.get('/reset/:id', (req, res) => {
      // console.log(id)
      res.render('reset', { id: req.params.id })
  });
  
  //------------ Register POST Handle ------------//
  router.post('/signup', authController.registerHandle);
  
  //------------ Email ACTIVATE Handle ------------//
  router.get('/activate/:token', authController.activateHandle);
  
  //------------ Forgot Password Handle ------------//
  router.post('/forgot', authController.forgotPassword);
  
  //------------ Reset Password Handle ------------//
  router.post('/reset/:id', authController.resetPassword);
  
  //------------ Reset Password Handle ------------//
  router.get('/forgot/:token', authController.gotoReset);
  
  //------------ Login POST Handle ------------//
  router.post('/signin', authController.loginHandle);
  
  //------------ Logout GET Handle ------------//
  router.get('/logout', authController.logoutHandle);
  
module.exports = router;