const Cart = require('../models/cart.model')

exports.index =(req,res) =>{
    var cart = req.session.cart;
    var totalQuantity =0
    if(cart){
        totalQuantity = cart.totalQuantity
    }
    res.render('index',{totalQuantity:totalQuantity})
}