var fs = require("fs")
var _ = require('lodash');
var path = require('path');
var yaml = require('js-yaml');



exports.i18n = function(req, res, next)
{
    var lang = req.query.lang || "zh-cn"
	var appBasePath = path.join(__dirname, '../../');
	var apps = []
	fs.readdir(appBasePath, function (err, files) {
		if (files && files.length) {
			files.forEach(function (filename) {
				if(filename!=".DS_Store")
					apps.push(filename)
			});
			var navs = {}
			var results = {}
			_.each(apps,function(app){
				var i18nPath = path.join(__dirname, '../../'+app+'/i18n/'+lang+'.yml');
				var i18nZhPath = path.join(__dirname, '../../'+app+'/i18n/zh-cn.yml');
				var doc;
				try{
					doc = yaml.safeLoad(fs.readFileSync(i18nPath, 'utf8'));
				}catch(error){
					doc = yaml.safeLoad(fs.readFileSync(i18nZhPath, 'utf8'));
				}
				results[app] = doc
			})
			_.each(navs,function(nav1,key1){

				results.push(nav1)
			})
			res.json(results)
			//console.log(JSON.stringify(results,null,2));
		}


	})


}
