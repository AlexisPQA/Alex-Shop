const passport = require('passport');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');
const JWT_KEY = "jwtactive987";
const JWT_RESET_KEY = "jwtreset987";

//------------ User Model ------------//
const User = require('../models/user.model');

//------------ Register Handle ------------//
exports.registerHandle = (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    var errorpassword2;
    var errorpassword;
    //------------ Checking password mismatch ------------//
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
        errorpassword2 = 'Passwords do not match'
    }

    //------------ Checking password length ------------//
    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
        errorpassword = 'Password must be at least 8 characters'
    }

    if (errors.length > 0) {
        res.render('login', {
            class : "sign-up-mode",
            errorpassword: errorpassword ,
            errorpassword2: errorpassword2,
            name,
            email,
            password,
            password2,
            
        });
    } else {
        //------------ Validation passed ------------//
        User.findOne({ email: email }).then(user => {
            if (user) {
                //------------ User already exists ------------//
                errorsEmail = 'Email ID already registered';
                res.render('login', {
                    class : "sign-up-mode",
                    erroremail : errorsEmail,
                    name,
                    email,
                    password,
                    password2
                });
            } else {

                const oauth2Client = new OAuth2(
                    "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com", // ClientID
                    "OKXIYR14wBB_zumf30EC__iJ", // Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );

                oauth2Client.setCredentials({
                    refresh_token: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w"
                });
                const accessToken = oauth2Client.getAccessToken()

                const token = jwt.sign({ name, email, password }, JWT_KEY, { expiresIn: '30m' });
                const CLIENT_URL = 'http://' + req.headers.host;

                const output = `
                <h2>Please click on below link to activate your account</h2>
                <p>${CLIENT_URL}/login/activate/${token}</p>
                <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
                `;

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: "OAuth2",
                        user: "nodejsa@gmail.com",
                        clientId: "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com",
                        clientSecret: "OKXIYR14wBB_zumf30EC__iJ",
                        refreshToken: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w",
                        accessToken: accessToken
                    },
                });

                // send mail with defined transport object
                const mailOptions = {
                    from: '"Auth Admin" <alexshop@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Account Verification: Alex-Shop Account Verify ✔", // Subject line
                    generateTextFromHTML: true,
                    html: output, // html body
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        req.flash(
                            'error',
                            'Something went wrong on our end. Please register again.'
                        );
                        res.redirect('/login');
                    }
                    else {
                        console.log('Mail sent : %s', info.response);
                        req.flash(
                            'success_msg',
                            'Activation link sent to email ID. Please activate to log in.'
                        );
                        res.redirect('/login');
                    }
                })

            }
        });
    }
}

//------------ Activate Account Handle ------------//
exports.activateHandle = (req, res) => {
    const token = req.params.token;
    let errors = [];
    if (token) {
        jwt.verify(token, JWT_KEY, (err, decodedToken) => {
            if (err) {
                req.flash(
                    'error',
                    'Incorrect or expired link! Please register again.'
                );
                res.redirect('/login');
            }
            else {
                const { name, email, password } = decodedToken;
                User.findOne({ email: email }).then(user => {
                    if (user) {
                        //------------ User already exists ------------//
                        req.flash(
                            'error',
                            'Email ID already registered! Please log in.'
                        );
                        res.redirect('/login');
                    } else {
                        const newUser = new User({
                            name,
                            email,
                            password
                        });

                        bcryptjs.genSalt(10, (err, salt) => {
                            bcryptjs.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser
                                    .save()
                                    .then(user => {
                                        req.flash(
                                            'success_msg',
                                            'Account activated. You can now log in.'
                                        );
                                        res.redirect('/login');
                                    })
                                    .catch(err => console.log(err));
                            });
                        });
                    }
                });
            }

        })
    }
    else {
        console.log("Account activation error!")
    }
}

//------------ Forgot Password Handle ------------//
exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    let errors = [];

    //------------ Checking required fields ------------//
    if (!email) {
        errors.push({ msg: 'Please enter an email ID' });
    }

    if (errors.length > 0) {
        res.render('resetpassword', {
            error_msg: "Please enter an email ID"
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (!user) {
                //------------ User already exists ------------//
                errors.push({ msg: 'User with Email ID does not exist!' });
                res.render('forgot', {
                    error_msg: "User with Email ID does not exist!"
                });
            } else {

                const oauth2Client = new OAuth2(
                    "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com", // ClientID
                    "OKXIYR14wBB_zumf30EC__iJ", // Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );

                oauth2Client.setCredentials({
                    refresh_token: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w"
                });
                const accessToken = oauth2Client.getAccessToken()

                const token = jwt.sign({ _id: user._id }, JWT_RESET_KEY, { expiresIn: '30m' });
                const CLIENT_URL = 'http://' + req.headers.host;
                const output = `
                <h2>Please click on below link to reset your account password</h2>
                <p>${CLIENT_URL}/login/forgot/${token}</p>
                <p><b>NOTE: </b> The activation link expires in 30 minutes.</p>
                `;

                User.updateOne({ resetLink: token }, (err, success) => {
                    if (err) {
                        errors.push({ msg: 'Error resetting password!' });
                        res.render('forgot', {
                            error_msg: "Error resetting password!"
                        });
                    }
                    else {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                type: "OAuth2",
                                user: "nodejsa@gmail.com",
                                clientId: "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com",
                                clientSecret: "OKXIYR14wBB_zumf30EC__iJ",
                                refreshToken: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w",
                                accessToken: accessToken
                            },
                        });

                        // send mail with defined transport object
                        const mailOptions = {
                            from: '"Auth Admin" <nodejsa@gmail.com>', // sender address
                            to: email, // list of receivers
                            subject: "Account Password Reset: NodeJS Auth ✔", // Subject line
                            html: output, // html body
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log(error);
                                req.flash(
                                    'error',
                                    'Something went wrong on our end. Please try again later.'
                                );
                                res.redirect('/login/forgot');
                            }
                            else {
                                console.log('Mail sent : %s', info.response);
                                req.flash(
                                    'success_msg',
                                    'Password reset link sent to email ID. Please follow the instructions.'
                                );
                                res.redirect('/login');
                            }
                        })
                    }
                })

            }
        });
    }
}

//------------ Redirect to Reset Handle ------------//
exports.gotoReset = (req, res) => {
    const { token } = req.params;

    if (token) {
        jwt.verify(token, JWT_RESET_KEY, (err, decodedToken) => {
            if (err) {
                req.flash(
                    'error',
                    'Incorrect or expired link! Please try again.'
                );
                res.redirect('/login');
            }
            else {
                const { _id } = decodedToken;
                User.findById(_id, (err, user) => {
                    if (err) {
                        req.flash(
                            'error',
                            'User with email ID does not exist! Please try again.'
                        );
                        res.redirect('/login');
                    }
                    else {
                        res.redirect(`/login/reset/${_id}`)
                    }
                })
            }
        })
    }
    else {
        console.log("Password reset error!")
    }
}


exports.resetPassword = (req, res) => {
    var { password, password2 } = req.body;
    const id = req.params.id;
    let errors = [];

    //------------ Checking required fields ------------//
    if (!password || !password2) {
        req.flash(
            'error',
            'Please enter all fields.'
        );
        res.redirect(`/login/reset/${id}`);
    }

    //------------ Checking password length ------------//
    else if (password.length < 8) {
        req.flash(
            'error',
            'Password must be at least 8 characters.'
        );
        res.redirect(`/login/reset/${id}`);
    }

    //------------ Checking password mismatch ------------//
    else if (password != password2) {
        req.flash(
            'error',
            'Passwords do not match.'
        );
        res.redirect(`/login/reset/${id}`);
    }

    else {
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(password, salt, (err, hash) => {
                if (err) throw err;
                password = hash;

                User.findByIdAndUpdate(
                    { _id: id },
                    { password },
                    function (err, result) {
                        if (err) {
                            req.flash(
                                'error',
                                'Error resetting password!'
                            );
                            res.redirect(`/login/reset/${id}`);
                        } else {
                            req.flash(
                                'success_msg',
                                'Password reset successfully!'
                            );
                            res.redirect('/login');
                        }
                    }
                );

            });
        });
    }
}

//------------ Login Handle ------------//
exports.loginHandle = (req, res, next) => {
    req.session.email = req.body.email
    console.log(req.session.email)
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
    })(req, res, next);
}

//------------ Logout Handle ------------//
exports.logoutHandle = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
}

exports.changepasswordindex = (req,res) =>{
    res.render('changepassword',{error_msg:req.flash('error')});
}

exports.changepassword = (req,res)=>{
    console.log(req.body.password1)
    var currentpassword = req.body.password
    var newPassword = req.body.password1
    var newPasswordConf = req.body.password2
    var match = false
    if (newPassword!= newPasswordConf){
        res.flash('error','Passwords do not match. Please try again.')
    }
    else{
        User.findOne({
            'email': req.session.email
        }).then(user => {
            //------------ Password Matching ------------//
            bcryptjs.compare(currentpassword, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    match =true
                    return done(null, false, { message: 'Password matched' });
                } else {
                    req.flash(
                        'error',
                        'Mật khẩu hiện tại không đúng.'
                    );
                    res.redirect('/login/changepassword')
                }
            });
        });
        if (match){
            bcryptjs.genSalt(10, (err, salt) => {
                bcryptjs.hash(newPasswordConf, salt, (err, hash) => {
                    if (err) throw err;
                    newPasswordConf = hash;
                    User.updateOne({'email':req.session.email},
                        {$set : {'password': newPasswordConf}},function(err,doc){
                            if(err){
                                console.log(err)
    
                            }
                            else{
                                req.logout()
                                req.flash(
                                    'success_msg',
                                    'Password changed. You can now log in.'
                                );
                                res.redirect('/login')
                            }
                        }
                    )
                });
            });
        }
        
        
    }
    
}
exports.checkcurrentpw = (req,res)=>{
    User.findOne({
        'email': req.session.email
    }).then(user => {
        //------------ Password Matching ------------//
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                res.end("Not Match")
                return done(null, false, { message: 'Password incorrect! Please try again.' });
            }
        });
    });
    
}