var restful = require('node-restful'),
    mongoose = require('mongoose');

var DepartmentScheme = mongoose.Schema({
     name: 'string',
	 lft: 'number',
	 rgt: 'number',
	 depth: 'number',
	 leader:{ type: 'ObjectId', ref: 'user' },
	 description:'string'
})
	
var Department = new restful.model(
   'department',
	DepartmentScheme).methods(['get', 'post', 'put', 'delete'])
exports = module.exports = Department;
