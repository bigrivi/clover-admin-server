var fs = require("fs")
var _ = require('lodash');
var path = require('path');
var yaml = require('js-yaml');

module.exports = class extends think.Service {
    constructor(ctx) {
        super(ctx);
    }

    async getLangData(lang){
        let modules = think.app.modules
        var results = {}
         _.each(modules,function(app){
            var i18nPath = path.join(think.APP_PATH, app+'/i18n/'+lang+'.yml');
            var i18nZhPath = path.join(think.APP_PATH, app+'/i18n/zh-cn.yml');
            var doc;
            try{
                doc = yaml.safeLoad(fs.readFileSync(i18nPath, 'utf8'));
            }catch(error){
                doc = yaml.safeLoad(fs.readFileSync(i18nZhPath, 'utf8'));
            }
            results[app] = doc
        })
        return results

    }

}