var bcrypt = require('bcryptjs');
var UserModel = require('../models/user');
var _ = require('underscore');
var fs = require("fs")
var AttachmentModel = require('../../uploader/models/attachment');
var authService = require('../../../auth/auth.service')
var AuthorizeModel = require('../models/authorize');

exports.onPostBefore = function(req, res, next)
{
	req.body.password_hash = bcrypt.hashSync(req.body.password_hash, 10);
	req.body.creation_on = new Date();
	next()
}


exports.authenticate = function(req, res, next)
{
	var userName = req.query.username;
	var password = req.query.password;
	if(userName && password){
		UserModel.findOne({ username: userName }).exec(function(error,userInfo){
			if(userInfo==null){
				res.json({"err":"用户不存在"})
				return
			}
			//console.log(password)
			bcrypt.compare(password, userInfo.password_hash, function(err, success){
				if (err) console.log(err);
				if(success){
					var authorizeNodes = []
					AuthorizeModel.find({auth_role_id:userInfo.role_id}).populate({path: "auth_node_id"}).exec(function(err,authorizeData){
						  _.each(authorizeData,function(item){
							  authorizeNodes.push(item.auth_node_id.node)
						  })
						  var token = authService.signToken(userInfo._id,req.jwtTokenSecret);
						  res.json({"userInfo":userInfo,authorizeNodes:authorizeNodes,"token":token})

					 })

				}else
					res.json({"err":"密码错误,请正确填写"})
			});


		})
	}else{
		res.json({"err":"用户名或密码不可为空"})
	}


}


exports.onDeleteBefore= function(req, res, next)
{
	var id = req.params.id
	UserModel.findById(id,function(err,userData){
		if(userData && userData.avatar){
			var picArr = userData.avatar.split(",");
			_.each(picArr,function(attachmentId){
				AttachmentModel.findById(attachmentId,function(err,attachmentInfo){
					if(err){
						console.log(err)
					}
					if(attachmentInfo){
						var filePath = attachmentInfo.real_url;
						fs.access(filePath, error => {
							if (!error) {
								fs.unlink(filePath,function(error){
									console.log(error);
								});
							} else {
								console.log(error);
							}
						});
						//删除附件数据
						attachmentInfo.remove(function (err, obj) {

						});
					}
				})

			})
		}
	});
	next();
}
