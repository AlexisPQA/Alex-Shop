var Cart = require('../models/cart.model');
const books = require('../models/book.model');
const user = require('../models/user.model')
exports.index = (req,res) =>{
    console.log(req.session.cart)
    var cart = new Cart(req.session.cart ? req.session.cart : {})
    var userName ="User"
    res.render('cart',{
        cart : cart.generateArr(),
        totalPrice : cart.totalPrice,
        totalQuantity: cart.totalQuantity,
        name: req.session.name
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
        req.session.save()
        console.log("add to cart succesed")
        console.log(req.session.cart)
        res.end('OK')
    })
}

exports.RemoveProduct = (req,res) =>{
    const id = req.params.id;
    var cart = new Cart(req.session.cart)
    cart.remove(id)
    req.session.cart = cart
    res.redirect('/cart')
}

exports.update = (req,res) =>{
    var cart = new Cart(req.session.cart ? req.session.cart : {})
    cart.update(req.body,req.body['id'])
    req.session.cart = cart
    console.log(cart)
    res.end('OK')
}

exports.purchase = (req,res) =>{
    var cart = new Cart(req.session.cart ? req.session.cart : {})
    user.updateOne(
                    {"email": req.session.email}, 
                    { $push: { "history": cart } }, 
                    function(err, doc) {
                        if(err){
                            console.log(err)
                        }
                        else{
                            console.log("Update succseed")
                            // res.end("OK")
                            res.redirect('/cart/buyed')
                        }
                    }
                );
}

exports.buyed =(req,res) =>{
    user.findOne({"email":req.session.email},
        function (err,user){
            if(err){
                console.log(Err)
            }else{
                history = user.history
                var cart = []
                for (item of history){
                    
                    cart.push(new Cart(item))
                }
                item = cart[0]
                res.render('buyed',{
                            cart : item.generateArr(),
                            totalQuantity: item.totalQuantity,
                            datebuy: item.datebuy,
                            name: user.name
                        })
            }
        }
    )
    
}