const books = require('../models/book.model')
const categories = require('../models/category.model')
var ObjectID = require('mongodb').ObjectID;
ItemPerPage = 9

exports.index = async (req, res, next) => {
	var url = req.url
	url = url.split("&page")[0]
	url = '/?'+ url.split("?")[1]
	console.log("URL:",url)
	const sortby = req.query.sort;
	const orderby = req.query.order;
	const page = +req.query.page || 1;
	var filter = false;
	if(typeof(sortby)!='undefined'){
		filter = true
	}
	if (sortby == "title"){
		if (orderby == 'ASC'){
			option = {
				sort:{
					'title': 1
				},
				page:page,
				limit:ItemPerPage,
			}
		}
		else{
			option = {
				sort:{
					'title': -1
				},
				page:page,
				limit:ItemPerPage,
			}
		}
	}else if (sortby == "basePrice"){
		if (orderby == 'ASC'){
			option = {
				sort:{
					'basePrice': 1
				},
				page:page,
				limit:ItemPerPage,
			}
		}
		else{
			option = {
				sort:{
					'basePrice': -1
				},
				page:page,
				limit:ItemPerPage,
			}
		}
	}
	else{
		if (orderby == 'ASC'){
			option = {
				sort:{
					'views': 1
				},
				page:page,
				limit:ItemPerPage,
			}
		}
		else{
			option = {
				sort:{
					'views': -1
				},
				page:page,
				limit:ItemPerPage,
			}
		}
	}
	console.log("Filter: ",filter)
	const paginate = await books.paginate({},option);
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
			category : category,
			filterd: filter,
			url :url
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
