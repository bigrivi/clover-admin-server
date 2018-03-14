var path = require('path');
var yaml = require('js-yaml');
var fs = require("fs")
var mongoose = require('mongoose');
require("./global")

// invoked in worker
think.beforeStartServer(async()=>{
    let config = think.config("model")["mongoose"]
    let connectString = getConnectString(config)
    mongoose.connect(connectString);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    let modules = think.app.modules
    let appConfigs = {}
    modules.forEach(function(module){
      var appCfgPath = path.join(think.APP_PATH, module+'/config.yml');
      var doc = yaml.safeLoad(fs.readFileSync(appCfgPath, 'utf8'));
      appConfigs[module] = doc
    })
    think.app.appConfigs = appConfigs
    think.app.MongooseModels = {}
    modules.forEach(function(module){
        let m = think.app.models[module];
        think._.each(m,(modelCls,name)=>{
            if(name!="base" && name!="tree")
                think.app.MongooseModels[name] = new modelCls(name)

        })

    })




})



