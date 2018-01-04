var product = require('./models/product');
var category = require('./models/category');
var tag = require('./models/tag');



exports = module.exports = function(app){
	var models = [
		[product,"products"],
		[category,"categories"],
		[tag,"tags"]
	];
	return models;
}