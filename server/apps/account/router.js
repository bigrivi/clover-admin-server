var user = require('./models/user');
var department = require('./models/department');

var userController = require('./controllers/users');
var departmentController = require('./controllers/departments');


exports = module.exports = function(){
	var models = [
		[user,"users"],
		[department,"departments"],
	];
	user.route('authenticate',userController.authenticate)
	department.route('getTreeNode',departmentController.getTreeNode)
	return models;
}