var user = require('./models/user');
var department = require('./models/department');
var userRole = require('./models/user_role');

var userController = require('./controllers/users');
var departmentController = require('./controllers/departments');


exports = module.exports = function(){
	var models = [
		[user,"users"],
		[userRole,"userRoles"],
		[department,"departments"],
	];
	user.route('authenticate',userController.authenticate)
	department.route('getTreeNode',departmentController.getTreeNode)
	return models;
}