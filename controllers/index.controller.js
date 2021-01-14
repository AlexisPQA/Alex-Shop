const Cart = require('../models/cart.model')
const user = require('../models/user.model')

exports.index =(req,res) =>{
    var cart = req.session.cart;
    var totalQuantity =0
    if (cart){
        totalQuantity = cart.totalQuantity
    }
    res.render('index',{totalQuantity:totalQuantity})
    
}