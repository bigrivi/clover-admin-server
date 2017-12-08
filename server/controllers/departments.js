var fs = require("fs")
var async = require('async')
var _ = require('underscore');
var tagModel = require('../models/tag');
var productModel = require('../models/product');
var AttachmentModel = require('../models/attachment');
var DepartmentModel = require('../models/department');

exports.onPostBefore= function(req, res, next)
{
	var parentId = req.body.parentId
	if(parentId){
		DepartmentModel.findById(parentId,function(err,parentInfo){
			async.series([
				function(callback){
					//更新右值 start
					var conditions = { rgt:{"$gte":parentInfo["rgt"]}};
					var update = { "$inc": { rgt: 2 }}
					var options = { multi: true };
					DepartmentModel.update(conditions, update, options, function(err,res){
						if(err){
							console.log(err);
						}
						if(res){
							console.log(res)
						}
						callback(null,null);
					});
					//end
				},
				function(callback){
					//更新左值 start
					var conditions = { lft:{"$gt":parentInfo["rgt"]}};
					var update = { "$inc": { lft: 2 }}
					var options = { multi: true };
					DepartmentModel.update(conditions, update, options, function(err,res){
						if(err){
							console.log(err);
						}
						if(res){
							console.log(res)
						}
						callback(null,null);
					});
					//end
				}
			],function(){
				req.body.lft = parentInfo["rgt"];
				req.body.rgt = parentInfo["rgt"]+1;
				req.body.depth = parentInfo["depth"]+1;
				next();
			})
			
		})
	}
	else{
		req.body.lft = 1;
		req.body.rgt = 2;
		req.body.depth = 1;
		next();
	}
}


exports.onDeleteBefore= function(req, res, next)
{ 
	
	var id = req.params.id;
	DepartmentModel.findById(id,function(err,nodeInfo){
		if(nodeInfo["lft"]==1){
			res.json({code:-1,err:"根级分类不可删除"});
			res.end();
			return;
		}
		var need_minus = nodeInfo['rgt'] - nodeInfo['lft'] + 1;
		need_minus = need_minus*-1
		async.series([
				function(callback){
					var conditions = { lft:{"$gte":nodeInfo["lft"],"$lte":nodeInfo["rgt"]}};
					DepartmentModel.remove(conditions, function(err,res){
						if(err){
							console.log(err);
						}
						if(res){
							console.log("remove success")
						}
						callback(null,null);
					});
				},
				function(callback){
					var conditions = { rgt:{"$gt":nodeInfo["rgt"]}};
					var update = { "$inc": { rgt: need_minus }}
					var options = { multi: true };
					DepartmentModel.update(conditions, update, options, function(err,res){
						if(err){
							console.log(err);
						}
						if(res){
							console.log(res)
						}
						callback(null,null);
					});
					
				},
				function(callback){
					var conditions = { lft:{"$gt":nodeInfo["rgt"]}};
					var update = { "$inc": { lft: need_minus }}
					var options = { multi: true };
					DepartmentModel.update(conditions, update, options, function(err,res){
						if(err){
							console.log(err);
						}
						if(res){
							console.log(res)
						}
						callback(null,null);
					});
				}
			],function(){
				res.json({code:0,err:""});
				res.end();
			})
		
	})
	
	
	
}

exports.getTreeNode = function(req, res, next)
{
	getTreeData(null,true,null,function(list){
		if(list.length<=0){
			res.json([])
			res.end()
		}
		var result = getChildNodes(list,true,list[0].lft,list[0].rgt,0)
		res.json({result:result});
		res.end()
	})
}

function getChildNodes(source,includeParent,lft,rgt,depth){
	if(!includeParent){
		lft+=1;
		rgt-=1;
	}
	var ret = _.filter(source,function(item){
		return item.depth==depth && item.lft>=lft && item.rgt<=rgt
	})
	ret = _.map(ret,function(item){
		var clone = {}
		clone.id = item.id;
		clone.name = item.name;
		var childs = getChildNodes(source,false,item.lft,item.rgt,item.depth+1);
		if(childs.length>0)
			clone.children = childs;
		return clone
	})
	return ret;
}


function getTreeData(parentId,includeParent,populates,callback)
{
	var findParams = {}
		var parentData;
		if(parentId){
			findParams._id = parentId;
		}
		DepartmentModel.findOne(findParams).sort({ _id: 1 }).exec(function(err, data) {
			parentData = data;
			if(data==null){
				callback([])
				return;
			}
			if(!includeParent){
				parentData['lft'] += 1;
				parentData['rgt'] -= 1;
			}
			if(populates){
				DepartmentModel.find({lft: { $gte: parentData["lft"], $lte: parentData["rgt"] }}).populate(populates).sort({ lft: 1 }).exec(function(err, list) {
					callback(list)
				});
			}
			else{
				DepartmentModel.find({lft: { $gte: parentData["lft"], $lte: parentData["rgt"] }}).sort({ lft: 1 }).exec(function(err, list) {
					callback(list)
				});
			}
			
		});
}


exports.onGetBefore= function(req, res, next)
{
	if(req.params.id){
		next()
	}
	else{
		var populates = {path: 'leader',select: 'realname',}
		getTreeData(req.query.parentId,true,populates,function(list){
			var right = [];
			_.each(list,function(row,index){
				if(right.length>0){
					// 检查是否应该将节点移出堆栈
					while(right[right.length-1]<row["rgt"]){
						right.pop();
					}
				}
				var rightLength = right.length;
				if(rightLength > 0) {
					row["prefix"] = "|"+'---'.repeat(rightLength)
				} else {
					row["prefix"] = "";
				}
				row["name"] = row["prefix"]+row["name"];
				right.push(row["rgt"])
			})
			var bundle = {record_count:list.length,result:list};
			res.json(bundle);
			res.end();
		})
	}
	
}
