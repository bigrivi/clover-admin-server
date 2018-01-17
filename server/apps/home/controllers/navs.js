var fs = require("fs")
var _ = require('lodash');
var path = require('path');
var yaml = require('js-yaml');
var UserModel = require('../../account/models/user');
var AuthorizeModel = require('../../account/models/authorize');

exports.navs = function(req, res, next)
{
	console.log("user=>")
	console.log(req.user)
	var appBasePath = path.join(__dirname, '../../');
	var apps = [];
	var authorizeNodes = []
	//console.log(appBasePath)
	UserModel.findById(req.user).exec(function(err,userInfo){
		  if(err){
			  callback(false);
		  }
		  AuthorizeModel.find({auth_role_id:userInfo.role_id}).populate({path: "auth_node_id"}).exec(function(err,authorizeData){
			  _.each(authorizeData,function(item){
				  authorizeNodes.push(item.auth_node_id.node)
			  })
			  loadNavs()
		  })

	 })

	function loadNavs(){
		fs.readdir(appBasePath, function (err, files) {
			if (files && files.length) {
				files.forEach(function (filename) {
					if(filename!=".DS_Store")
						apps.push(filename)
				});
				var navs = {}
				var results = []
				_.each(apps,function(app){
					var appCfgPath = path.join(__dirname, '../../'+app+'/config.yml');
					var doc = yaml.safeLoad(fs.readFileSync(appCfgPath, 'utf8'));
					if(doc["navs"])
						navs = _.merge(navs,doc["navs"])
				})
				_.each(navs,function(nav1,key1){
					console.log("_"+key1)
					var nav2Children = []
					_.each(nav1.children,function(nav2,key2){
						console.log("_____"+key2)
						nav2.alias = key2
						nav2.children = nav2.children || []
						if(nav2.children){
							var nav3Children = []
							_.each(nav2.children,function(nav3,key3){
								console.log("_____________"+key3)
								nav3.alias = key3
								if(checkNavPermission(nav3))
									nav3Children.push(nav3)
							})
							nav2.children = nav3Children
						}
						if(checkNavPermission(nav2) && nav2.children.length>0)
							nav2Children.push(nav2)
						else if(checkNavPermission(nav2) && nav2.link)
							nav2Children.push(nav2)

					})
					nav1.alias = key1
					nav1.ord = nav1.ord || 0;
					nav1.children = nav2Children;
					if(checkNavPermission(nav1) && nav1.children.length>0)
						results.push(nav1)
				})
				results = _.sortBy(results,function(item){
					return -item.ord
				})
				res.json(results)
			}


		})
	}


	function checkNavPermission(nav){
		if(!nav.link){
			return true
		}
		var node = nav.auth_node
		if(!node){
			node = nav.link.split("/").join(".")+".get"
		}
		return authorizeNodes.indexOf(node)>=0

	}


}
