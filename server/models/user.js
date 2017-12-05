var restful = require('node-restful'),
    mongoose = require('mongoose');
	
var User = new restful.model(
   'user',
	mongoose.Schema({
     username: 'string',
     password_hash: 'string',
	 realname: 'string',
	 gender: 'string',
	 email: 'string',
	 creation_on: 'date',
	 avatar: 'string'
  })).methods(['get', 'post', 'put', 'delete'])
exports = module.exports = User;
