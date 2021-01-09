const books = require('../models/book.model')
const categories = require('../models/category.model')
var ObjectID = require('mongodb').ObjectID;
ItemPerPage = 9

exports.index = async (req, res, next) => {
	const page = +req.query.page || 1;
	const paginate = await books.paginate({},{
		page:page,
		limit:ItemPerPage,
	});
	await categories.find().then(function(category){
		res.render('products',{
			book: paginate.docs,
			currentPage : paginate.page,
			hasNextPage : paginate.hasNextPage,
			hasPreviousPage : paginate.hasPrevPage,
			nextPage : paginate.nextPage,
			prevPage : paginate.prevPage,
			lastPage : paginate.totalPages,
			ITEM_PER_PAGE: ItemPerPage,
			category : category
		})
	})	
};

exports.detail =  (req,res,next) => {
	const id = req.params.id
	books.findById(id, function (err, book) {
		if (err){
			console.log('error')
		}else{
			const views = book.views + 1;
			books.updateOne(
				{"_id": ObjectID(book.id)}, 
				{ $set: { "views": views } }, 
				function(err, doc) {
					console.log(err)
				}
			);
			book.views = views
			console.log(book.views)
			res.render('productDetails', {book:book});
		}
	});
}