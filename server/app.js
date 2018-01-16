var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    restful = require('node-restful');
var app = module.exports = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());
app.set('jwtTokenSecret', "clover-admin");
app.all('*',function (req, res, next) {
	req.jwtTokenSecret = app.get('jwtTokenSecret')
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild,language,accesstoken,version');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    //res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.set('view engine', 'jade');
app.mongoose = mongoose; // used for testing
mongoose.connect("mongodb://localhost/ir");
require('./router')(app);
app.listen(3000);

