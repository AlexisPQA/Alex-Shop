var moongse = require('mongoose')
var categoriesSchema = new moongse.Schema({
    name: String
});
var categories = moongse.model('categories',categoriesSchema,'categories')
module.exports = categories