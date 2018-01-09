var yaml = require('js-yaml');
var fs   = require('fs');
var path = require('path');
var _ = require('lodash');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/erp');
db = mongoose.connection;
var AuthNodeSchema = mongoose.Schema({
 node: String,
 app:String
});
var AuthNodeModel = mongoose.model('auth_node', AuthNodeSchema);
db.once('open', function callback () {
  console.log("connection success");
  AuthNodeModel.remove({}, function(err, res){ //remove old data
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }
		generate()
    })
  
});	


function generate(){
	var appBasePath = path.join(__dirname, 'server/apps/');
	var apps = []
	fs.readdir(appBasePath, function (err, files) {
		if (files && files.length) {
			files.forEach(function (filename) {
				apps.push(filename)
			});
			_.each(apps,function(app){
				var appCfgPath = path.join(__dirname, 'server/apps/'+app+'/config.yml');
				var doc = yaml.safeLoad(fs.readFileSync(appCfgPath, 'utf8'));
				var auth_nodes = doc["auth_nodes"]
				if(auth_nodes){
					_.each(auth_nodes,function(auth_node){
						console.log(app,auth_node);
						var node_items = auth_node.split(".")
						var app = node_items[0];
						var module = node_items[1];
						var method = node_items[2];
						if(method=="*"){
							var all_methods = ["get","put","delete","post"];
							_.each(all_methods,function(method){
								auth_node = app+"."+module+"."+method;
								var newNode = new AuthNodeModel({ node: auth_node,app:app});
								newNode.save();
							})
						}
						else{
							var newNode = new AuthNodeModel({ node: auth_node,app:app});
							newNode.save();
						}
						
					})
				}
				
			})
			
			
		}
	})
}


	