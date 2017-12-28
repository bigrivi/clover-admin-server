var user = require('./models/user');
var product = require('./models/product');
var category = require('./models/category');
var tag = require('./models/tag');
var attachment = require('./models/attachment');
var department = require('./models/department');

var userController = require('./controllers/users');
var attachmentController = require('./controllers/attachments');
var departmentController = require('./controllers/departments');

var pager = require('./middlewares/pager');
var uploader = require('./middlewares/uploader');
var exportData = require('./middlewares/export');
var authService = require('./auth/auth.service')



exports = module.exports = function(app){
	var models = [
	[user,"users"],
	[product,"products"],
	[category,"categories"],
	[attachment,"attachments"],
	[department,"departments"],
	[tag,"tags"]];
	
	user.route('authenticate',userController.authenticate)
	attachment.route('preview',attachmentController.preview)
	department.route('getTreeNode',departmentController.getTreeNode)
	//attachment.route('preview',attachmentController.preview).before("preview",authService.userLoginRequire);
	
	for(var i=0;i<models.length;i++){
		var model = models[i][0]; //model
		var key = models[i][1]; //key
		
		//token验证
		//model.before('get',authService.userLoginRequire)
		//model.before('put',authService.userLoginRequire)
		//model.before('post',authService.userLoginRequire)
		//model.before('delete',authService.userLoginRequire)
		
		try{
			var controller = require('./controllers/'+key);
			if(controller["onPutBefore"]){ //修改前
				model.before('put',controller["onPutBefore"])
			}
			if(controller["onPutAfter"]){ //修改后
				model.after('put',controller["onPutAfter"])
			}
			if(controller["onPostBefore"]){ //增加前
				model.before('post',controller["onPostBefore"])
			}
			if(controller["onPostAfter"]){ //增加后
				model.after('post',controller["onPostAfter"])
			}
			
			if(controller["onGetBefore"]){ //get前
				model.before('get',controller["onGetBefore"])
			}
			if(controller["onGetAfter"]){ //get后
				model.after('get',controller["onGetAfter"])
			}
			
			if(controller["onDeleteBefore"]){ //delete前
				model.before('delete',controller["onDeleteBefore"])
			}
			if(controller["onDeleteAfter"]){ //delete后
				model.after('delete',controller["onDeleteAfter"])
			}
			
		}catch(error){
			//console.log(error)
		}
		model.after('get',pager)
		model.before('put',uploader)
		model.before('post',uploader);
		model.route('export',exportData)
		
	}
	for(var i=0;i<models.length;i++){
		models[i][0].register(app, "/"+models[i][1]);
	}
	
}