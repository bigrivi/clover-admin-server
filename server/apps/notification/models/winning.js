var restful = require('node-restful'),
    mongoose = require('mongoose');

var Winning = new restful.model(
   'winning',
	mongoose.Schema({
     active_name: 'string', //调研活动名称
     enabled_status: 'number', //启用状态 0 禁用 1 启用
     diaoyan_status: 'number', //状态 0 禁用 1 启用
  })).methods(['get', 'post', 'put', 'delete'])
exports = module.exports = Winning;
