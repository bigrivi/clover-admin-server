var tagModel = require('../models/tag');
var productModel = require('../models/product');

exports.recommend = function(req, res, next)
{
	return res.json({ status: 500, err: "recommend index" });
}


exports.onGetBefore = function(req, res, next)
{
	next();
}


exports.onGetAfter = function(req, res, next)
{
	next();
}

exports.onPostBefore = function(req, res, next)
{
	//res.json({ status: 500, err: "users get before" });
	next()
}

exports.onPostAfter = function(req, res, next)
{
	next()
}

exports.onPutBefore = function(req, res, next)
{
	console.log("tag modify ",req.params.id)
	//tagModel.findById(req.params.id,function(err, doc){
		//console.log(doc)
	//});
	productModel.count({"tags":req.params.id}, function(err, count){
		req.body.count = count;
		next()
	});
	//res.json({ status: 500, err: "users get before" });
	
}

exports.onPutAfter = function(req, res, next)
{
	next()
}