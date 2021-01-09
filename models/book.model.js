var moongse = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
var bookSchema = new moongse.Schema({
    title: String,
    cover: String,
    detail: String,
    basePrice: String,
    category:String,
    author:String
});

bookSchema.plugin(mongoosePaginate)
var Books = moongse.model('book',bookSchema,'books')
module.exports = Books

