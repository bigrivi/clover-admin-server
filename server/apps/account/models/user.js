var restful = require('node-restful'),
    mongoose = require('mongoose');


var model = new restful.model(
   'user',
	mongoose.Schema({
     username: 'string',
     password_hash: 'string',
	 realname: 'string',
	 gender: 'string',
	 hobby: 'string',
	 email: 'string',
	 department_id:{ type: 'ObjectId', ref: 'department' },
	 creation_on: 'date',
	 avatar: 'string'
  })).methods(['get', 'post', 'put', 'delete'])
  
exports = module.exports = model;
