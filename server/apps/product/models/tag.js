var restful = require('node-restful'),
    mongoose = require('mongoose');
	
var Tag = new restful.model(
   'tag',
	mongoose.Schema({
     name: 'string',
	 count: 'number'
  })).methods(['get', 'post', 'put', 'delete'])
exports = module.exports = Tag;
