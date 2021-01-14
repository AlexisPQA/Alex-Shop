var Cart = require('../models/cart.model');
const books = require('../models/book.model');

exports.index = (req,res) =>{
    console.log(req.session.cart)
    var cart = new Cart(req.session.cart)
    res.render('cart',{
        cart : cart.generateArr(),
        totalPrice : cart.totalPrice,
        totalQuantity: cart.totalQuantity
    })
}

exports.AddProduct = (req,res)=>{
    const id = req.params.id
    var cart = new Cart(req.session.cart ? req.session.cart : {})
    books.findById(id, function(err,book){
        if(err){
            res.redirect('/')
        }
        cart.add(book,book.id)
        req.session.cart = cart
        // console.log(req.session.cart)
        // res.redirect('/products')
    })
}

exports.RemoveProduct = (req,res) =>{
    const id = req.params.id;
    var cart = new Cart(req.session.cart)
    cart.remove(id)
    req.session.cart = cart
    console.log("cart after remove:",req.session.cart)
    res.redirect('/cart')
}

exports.update = (req,res) =>{
    var cart = new Cart(req.session.cart ? req.session.cart : {})
    cart.update(req.body,req.body['id'])
    req.session.cart = cart
    console.log(cart)
}