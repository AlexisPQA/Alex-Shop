var moongse = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
var bookSchema = new moongse.Schema({
    title: String,
    cover: String,
    detail: String,
    basePrice: Number,
    category:String,
    author:String,
    views : Number,
});

bookSchema.plugin(mongoosePaginate)
var Books = moongse.model('book',bookSchema,'books')
module.exports = Books

