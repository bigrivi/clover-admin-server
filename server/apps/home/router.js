var navController = require('./controllers/navs');
var i18nController = require('./controllers/i18n');


exports = module.exports = function(app){
	var models = [
		
	];
	app.use('/home/navs',navController.navs)
	app.use('/home/i18n',i18nController.i18n)
	return models;
}