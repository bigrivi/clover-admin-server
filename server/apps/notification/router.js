var email = require('./models/email');
var sms = require('./models/sms');
var template = require('./models/template');
var winning = require('./models/winning');


exports = module.exports = function(app){
	var models = [
		[email,"emails"],
        [sms,"smss"],
        [template,"templates"],
        [winning,"winnings"]
	];
	return models;
}