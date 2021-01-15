const user = require('../models/user.model')
const multer = require('multer')
exports.index = (req,res) =>{
    user.findOne({
        email: req.session.email
    }).then(user => {
        if(user){
            res.render('profile',{avatar: user.avatar,name:user.name, email:user.email})
        }
        else{
            res.redirect('/')
        }
    });
    
}