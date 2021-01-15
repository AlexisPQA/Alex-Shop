const user = require('../models/user.model')
const multer = require('multer')
const formidable = require('formidable');
const userService = require('../models/services/profileService');


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

//UPDATE USER TO SERVER
exports.updateuser = async(req,res,next) => {
    let userEmail = req.session.email;
    const form = formidable({ multiples: true });

     form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        userService.putUser(fields, userEmail, files.file.path).then((err,resp) => {
            res.redirect('/profile');
        });
    });
}