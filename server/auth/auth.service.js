var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');


function signToken(uid,jwtTokenSecret){
	return jwt.sign({
		expires: new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
		uid: uid
    }, jwtTokenSecret);
  
}

function decodeToken(token, jwtTokenSecret) {
  try {
    return jwt.verify(token, jwtTokenSecret)
  } catch (e) {
    return null
  }
}

function verifyToken(req, callback){
  var token = String(req.headers.accesstoken || req.body.access_token || '');
  if (!token || token == 'undefined') {
    callback(false);
    return;
  }
  let decoded = decodeToken(token, req.jwtTokenSecret)
  if(!decoded){
	callback(false);
    return;
  }
  if (decoded && decoded.expires && decoded.expires < new Date().getTime()) { //token过期
    return callback(false)
  }
  if(decoded.uid){
	  /**
	  UserModel.findById(decoded.uid,function(err,userInfo){
		  if(err){
			  callback(false);
		  }
		  req.user = userInfo;
		  console.log(req.user)
		  callback(true);
	  })
	  **/
	  req.user = decoded.uid;
	  callback(true);
  }
  else{
	 callback(false);
  }
  
  
}

function userLoginRequire(req,res,next){
	verifyToken(req,function(success){
		if(success){
			next()
		}
		else{
			return res.status(401).send(); //Unauthorized Error
		}
	})
}

exports.signToken = signToken
exports.decodeToken = decodeToken
exports.userLoginRequire = userLoginRequire


