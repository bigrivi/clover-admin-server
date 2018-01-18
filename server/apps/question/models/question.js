var restful = require('node-restful'),
    mongoose = require('mongoose');

var Question = new restful.model(
   'question',
	mongoose.Schema({
     name: 'string',
	 enabled_status: 'number',
     creation_on: { type: 'date', default: new Date()},
  })).methods(['get', 'post', 'put', 'delete'])
exports = module.exports = Question;
