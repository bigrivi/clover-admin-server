var yaml = require('js-yaml');
var fs   = require('fs');
var path = require('path');

var authService = require('./auth/auth.service')
var pager = require('./middlewares/pager');
var uploader = require('./middlewares/uploader');
var exportData = require('./middlewares/export');

exports = module.exports = function(app){
	//var appCfgPath = path.join(__dirname, './apps/account/config.yml');
	//var doc = yaml.safeLoad(fs.readFileSync(appCfgPath, 'utf8'));
	//console.log(doc["navs"]);
	var appBasePath = path.join(__dirname, './apps');
	var apps = []
	fs.readdir(appBasePath, function (err, files) {
		if (files && files.length) {
			files.forEach(function (filename) {
				if(filename!="common" && filename!=".DS_Store"){
					console.log("app:"+filename);
					apps.push(filename)
				}
			});
			apps.forEach(function(appName){
				//console.log("============="+appName+"=================")
				var router = require("./apps/"+appName+"/router")(app);
				router.forEach(function(models){
					var model = models[0]; //model
					var key = models[1]; //key
					//console.log("module:"+key+"")
					//token验证
					model.before('get',authService.userLoginRequire)
					model.before('put',authService.userLoginRequire)
					model.before('post',authService.userLoginRequire)
					model.before('delete',authService.userLoginRequire)
					try{
						var controller = require("./apps/"+appName+"/controllers/"+key);
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
					model.route('export',exportData);
					model.register(app, "/"+appName+"/"+key);


				})
			})
		}
	 });


}