var yaml = require('js-yaml');
var fs   = require('fs');
var path = require('path');
var _ = require('lodash');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ir');
db = mongoose.connection;
var AuthNodeSchema = mongoose.Schema({
 node: String,
 app:String
});
var peddingTasks = []
var AuthNodeModel = mongoose.model('auth_node', AuthNodeSchema);
db.once('open', function callback () {
  console.log("connection success");
  generate();
  /**
  AuthNodeModel.remove({}, function(err, res){ //remove old data
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }
		generate()
    })
    **/

});


function processNextTask(){
	var task = peddingTasks.shift()
    //console.log(task)
    AuthNodeModel.find({node: task.node,app:task.app},function(err,docs){
        if(docs.length<=0){
            task.save(function (err) {
                if(err) {
                    console.error(err);
                }
                if(peddingTasks.length>0)
                    processNextTask()
                else
                    console.log("all complate")
            })
        }
        else{
            if(peddingTasks.length>0)
                processNextTask()
            else
                console.log("all complate")
        }

    })
}



function generate(){
	var appBasePath = path.join(__dirname, 'server/apps/');
	var apps = []
	fs.readdir(appBasePath, function (err, files) {
		if (files && files.length) {
			files.forEach(function (filename) {
                if(filename!=".DS_Store")
				    apps.push(filename)
			});
			peddingTasks = []
			_.each(apps,function(app){
				var appCfgPath = path.join(__dirname, 'server/apps/'+app+'/config.yml');
				var doc = yaml.safeLoad(fs.readFileSync(appCfgPath, 'utf8'));
				var auth_nodes = doc["auth_nodes"]
				if(auth_nodes){
					_.each(auth_nodes,function(auth_node){
						//console.log(app);
						var node_items = auth_node.split(".")
						var appName = node_items[0];
						var module = node_items[1];
						var method = node_items[2];
						if(method=="*"){
							var all_methods = ["get","post","put","delete"];
							_.each(all_methods,function(method){
								auth_node = appName+"."+module+"."+method;
								peddingTasks.push(new AuthNodeModel({ node: auth_node,app:appName}));
							})
						}
						else{
							peddingTasks.push(new AuthNodeModel({ node: auth_node,app:appName}));
						}

					})
				}
			})
			console.log(peddingTasks.length)
			processNextTask()


		}
	})
}




