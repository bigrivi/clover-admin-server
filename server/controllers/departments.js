var fs = require("fs")
var async = require('async')
var util = require('util')
var _ = require('underscore');
var tree = require('./tree');


var onGetBefore= function(req, res, next)
{
	if(req.params.id){
		next()
	}
	else{
		var populates = {path: 'leader',select: 'realname',}
		tree.getTreeData(req.query.parentId,true,populates,function(list){
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

var self = {
	onGetBefore:onGetBefore
}
_.defaults(self, tree);





exports = module.exports = self