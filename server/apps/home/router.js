var navController = require('./controllers/navs');
var i18nController = require('./controllers/i18n');
var authService = require('../../auth/auth.service')


exports = module.exports = function(app){
	var models = [
		
	];
	app.get('/home/navs',authService.userLoginRequire,navController.navs)
	app.get('/home/i18n',i18nController.i18n)
	return models;
}