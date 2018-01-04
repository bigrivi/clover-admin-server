var attachment = require('./models/attachment');
var attachmentController = require('./controllers/attachments');


exports = module.exports = function(app){
	var models = [
		[attachment,"attachments"]
	];
	attachment.route('preview',attachmentController.preview)
	return models;
}