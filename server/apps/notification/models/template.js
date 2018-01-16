var restful = require('node-restful'),
    mongoose = require('mongoose');

var Template = new restful.model(
   'template',
	mongoose.Schema({
     name: 'string', //模板名称
	 kind: 'string', //类型
     project: 'string', //调研项目
     status: 'number', //状态 0 禁用 1 启用
  })).methods(['get', 'post', 'put', 'delete'])
exports = module.exports = Template;
