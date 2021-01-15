const Cart = require('../models/cart.model')
const user = require('../models/user.model')

exports.index =(req,res) =>{
    var cart = req.session.cart;
    var totalQuantity =0
    if (cart){
        totalQuantity = cart.totalQuantity
    }
    user.findOne({"email":req.session.email},function(err,userLogged){
        if(err){
            console.log(err)
        }else{
            req.session.name = userLogged.name
            res.render('index',{totalQuantity:totalQuantity,name:userLogged.name})
        }
    })
    
    
}