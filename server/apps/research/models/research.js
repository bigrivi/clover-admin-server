var restful = require('node-restful'),
    mongoose = require('mongoose');

var Research = new restful.model(
   'research',
	mongoose.Schema({
     name: 'string',
	 enabled_status: 'number',
     research_status: 'number',
  })).methods(['get', 'post', 'put', 'delete'])
exports = module.exports = Research;
