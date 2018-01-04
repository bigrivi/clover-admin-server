var restful = require('node-restful'),
    mongoose = require('mongoose');

var Product = new restful.model(
   'product',
	mongoose.Schema({
		name: 'string',
		price:'number',
		measuring_unit:'string',
		model: 'string',
		producing_area:'string',
		serial_number:'string',
		bar_code:'string',
		category_id:{ type: 'ObjectId', ref: 'category' },
		creation_on:'date',
		introduction:'string',
		pic:'string',
		tags:[
			{type:'ObjectId', ref: 'tag'}
		]
  })).methods(['get', 'post', 'put', 'delete'])
  
exports = module.exports = Product;
