const mongoose = require('mongoose');

//------------ User Schema ------------//
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  resetLink: {
    type: String,
    default: ''
  },
  avatar: {
    type:String,
    default:'https://www.flaticon.com/svg/vstatic/svg/3135/3135715.svg?token=exp=1610650644~hmac=947b6ec1f9d20c858ed990b307393dc9'
  },
  blocked:{
    type:Boolean,
    default:false
  }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema,'users');

module.exports = User;