var restful = require('node-restful'),
    mongoose = require('mongoose');

var UserRoleScheme = mongoose.Schema({
    name: String,
	description:String
})
	
var UserRoleModel = new restful.model(
   'user_role',
	UserRoleScheme).methods(['get', 'post', 'put', 'delete'])
exports = module.exports = UserRoleModel;
