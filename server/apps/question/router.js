var question = require('./models/question');



exports = module.exports = function(app){
	var models = [
		[question,"questions"]
	];
	return models;
}