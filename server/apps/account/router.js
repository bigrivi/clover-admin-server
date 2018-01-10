var user = require('./models/user');
var department = require('./models/department');
var userRole = require('./models/user_role');
var AuthNode = require('./models/auth_node');
var Authorize = require('./models/authorize');

var userController = require('./controllers/users');
var departmentController = require('./controllers/departments');


exports = module.exports = function(){
	var models = [
		[user,"users"],
		[userRole,"userRoles"],
		[AuthNode,"authNodes"],
		[Authorize,"authorize"],
		[department,"departments"],
	];
	user.route('authenticate',userController.authenticate)
	department.route('getTreeNode',departmentController.getTreeNode)
	return models;
}