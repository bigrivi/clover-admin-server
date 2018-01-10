var restful = require('node-restful'),
    mongoose = require('mongoose');

var AuthorizeScheme = mongoose.Schema({
    auth_node_id: { type: 'ObjectId', ref: 'auth_node' },
	auth_role_id:String
})
	
var Authorize = new restful.model(
   'authorize',
	AuthorizeScheme).methods(['get', 'post', 'put', 'delete'])
exports = module.exports = Authorize;
