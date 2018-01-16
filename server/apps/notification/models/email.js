var restful = require('node-restful'),
    mongoose = require('mongoose');

var Email = new restful.model(
   'email',
	mongoose.Schema({
     active_name: 'string', //调研活动名称
	   template_name: 'string', //模板名称
     pici: 'string', //批次
     sended_total: 'number', //发送总量
     sended_success: 'number', //发送成功
     sending_total: 'number' //发送中
  })).methods(['get', 'post', 'put', 'delete'])
exports = module.exports = Email;
