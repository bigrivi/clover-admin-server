var fs = require("fs")
var _ = require('lodash');
var path = require('path');
var yaml = require('js-yaml');



exports.navs = function(req, res, next)
{
	var appBasePath = path.join(__dirname, '../../');
	var apps = []
	console.log(appBasePath)
	fs.readdir(appBasePath, function (err, files) {
		if (files && files.length) {
			files.forEach(function (filename) {
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
					if(nav2.children){
						var nav3Children = []
						_.each(nav2.children,function(nav3,key3){
							console.log("_____________"+key3)
							nav3.alias = key3
							nav3Children.push(nav3)
						})
						nav2.children = nav3Children
					}
					nav2Children.push(nav2)
					
				})
				nav1.alias = key1
				nav1.children = nav2Children;
				results.push(nav1)
			})
			res.json(results)
			console.log(JSON.stringify(results,null,2));
		}
		
		
	})
	
	
}
