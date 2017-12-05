var restful = require('node-restful'),
    mongoose = require('mongoose');
	
var Attachment = new restful.model(
   'attachment',
	mongoose.Schema({
     real_url: 'string',
     source_name: 'string',
	 file_size: 'number',
	 file_mime: 'string',
	 creation_on: 'date'
  })).methods(['get', 'post', 'put', 'delete'])
exports = module.exports = Attachment;
