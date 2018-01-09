var restful = require('node-restful'),
    mongoose = require('mongoose');

var AuthNodeScheme = mongoose.Schema({
    node: String,
	app:String
})
	
var AuthNode = new restful.model(
   'auth_node',
	AuthNodeScheme).methods(['get', 'post', 'put', 'delete'])
exports = module.exports = AuthNode;
