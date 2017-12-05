var tagModel = require('../models/tag');
var productModel = require('../models/product');
var _ = require('underscore');
var fs = require("fs")
var AttachmentModel = require('../models/attachment');


function updateTagCount(tagId){
	productModel.count({"tags":tagId}, function(err, newCount){
		  console.log(tagId)
		  var conditions = { _id: tagId };
		  var update = { $set: {
			count: newCount,
		  }};
		  tagModel.update(conditions, update).exec(function(){});
	});
		
}


exports.onGetAfter = function(req, res, next)
{
	next()
}


exports.onPutAfter = function(req, res, next)
{
	console.log("product put after")
	var tags = req.body.tags
	//更新标签数量
	next()
	for(var i=0;i<tags.length;i++){
		var tagId = tags[i]
		updateTagCount(tagId)
		
	}
}

exports.onPutBefore = function(req, res, next)
{
	//res.json({ code: -1, err: "测试错误发生" });
	next();
}


exports.onDeleteBefore= function(req, res, next)
{
	var id = req.params.id
	productModel.findById(id,function(err,productData){
		if(productData && productData.pic){
			var picArr = productData.pic.split(",");
			_.each(picArr,function(attachmentId){
				AttachmentModel.findById(attachmentId,function(err,attachmentInfo){
					if(err){
						console.log(err)
					}
					if(attachmentInfo){
						//console.log(attachmentInfo)
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



