const books = require('../models/book.model')
ItemPerPage = 9
// exports.index = (req, res, next) => {
//     books.find().then(function(book){
// 		res.render('products', {book:book});
// 	})
// };

exports.index = async (req, res, next) => {
	const page = +req.query.page || 1;
	const paginate = await books.paginate({},{
		page:page,
		limit:ItemPerPage,
	});
	console.log(paginate)
	res.render('products',{
		book: paginate.docs,
		currentPage : paginate.page,
		hasNextPage : paginate.hasNextPage,
		hasPreviousPage : paginate.hasPrevPage,
		nextPage : paginate.nextPage,
		prevPage : paginate.prevPage,
		lastPage : paginate.totalPages,
		ITEM_PER_PAGE: ItemPerPage,
	})
};

exports.detail = (req,res,next) => {
	const id = req.params.id
	books.findById(id, function (err, book) {
		if (err){
			console.log('error')
		}else{
            console.log(book)
			res.render('productDetails', {book:book});
		}
	});
}