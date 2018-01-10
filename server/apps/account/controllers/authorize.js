var bcrypt = require('bcryptjs');
var UserModel = require('../models/user');
var _ = require('underscore');
var fs = require("fs")
var AttachmentModel = require('../../uploader/models/attachment');
var AuthorizeModel = require('../models/authorize');
var authService = require('../../../auth/auth.service')

exports.onPostBefore = function(req, res, next)
{
	var role_id = req.body.role_id
	var nodes = req.body.nodes
	console.log(nodes)
	AuthorizeModel.remove({auth_role_id:role_id}, function(err, reault){ //remove old data
        if (err) {
            console.log("Error:" + err);
        }
        else {
			_.each(nodes,function(auth_node_id){
				var authNode = new AuthorizeModel({auth_node_id:auth_node_id,auth_role_id:role_id})
				authNode.save()
			})
            res.json({})
			res.end()
        }
		
    })
	
	
}




