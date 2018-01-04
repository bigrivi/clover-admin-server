var restful = require('node-restful'),
    mongoose = require('mongoose');
	
var Category = new restful.model(
   'category',
	mongoose.Schema({
     name: 'string',
  })).methods(['get', 'post', 'put', 'delete'])
exports = module.exports = Category;
