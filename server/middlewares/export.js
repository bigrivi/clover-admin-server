var _ = require('underscore');
var fs = require("fs")
var mongoose = require('mongoose');
var json2csv = require('json2csv');
var encoding = require('encoding');
var xml2js = require('xml2js');
var nodeExcel = require('excel-export');

exports = module.exports = function(req, res, next)
{
	var format = req.query.format //导出格式，csv/excel/json/xml
	var resource = req.query.resource //导出模型
	var app = req.query.app //所在app
	var fields = req.query.fields; //导出字段
	var encodingTo = req.query.encodingTo || "GB2312"; //csv编码格式
	var fieldNames = req.query.fieldNames || ""; //导出字段名
	var colSep = req.query.colSep || ",";
	var sortField = req.query.sortField || "_id"; //排序字段
	var sort = req.query.sort || "desc"; //排序
	var skipHeader = req.query.skipHeader || true; //不显示表格头
	var fieldsArr = fields.split(",");
	var fieldNamesArr = fieldNames.split(",");
	var populates = req.query.populates || "";//category_id,tags
	var ResourceModel = require('../apps/'+app+'/models/'+resource.substr(0,resource.length-1));
	var populatesArr = populates.split(",")
	var exportFileName = resource
	var selects = {}
	_.each(fieldsArr,function(item){
		selects[item] = 1
	})
	var sortOption = {}
	if(sort=="asc")
		sortOption[sortField] = 1;
	else
		sortOption[sortField] = -1;
	var model = ResourceModel.find({},selects,{sort:sortOption})
	_.each(populatesArr,function(item){
		model.populate({path: item,select: 'name-_id'})
	})
	req.quer.exec(function(err,data){
		var formatData = _.map(data,function(row){
			var formatRow = {};
			_.each(fieldsArr,function(fieldName){
				var fieldData = row[fieldName];
				var isType = mongoose.Types.ObjectId.isValid(fieldData);
				if(_.isArray(fieldData))
					fieldData = _.map(fieldData,function(item){return item.name||item}).join(",")
				else if(_.isObject(fieldData) && fieldName!="_id"){
					fieldData = fieldData["name"] || fieldData;
				}
				formatRow[fieldName] = fieldData
			})
			return formatRow
		})
		if(format=="json"){
			res.attachment(exportFileName+'.json');
			res.send(formatData);
			res.end();
		}else if(format=="csv"){
			var fields = fieldsArr;
			var fieldNames = fieldNamesArr;
			if(fieldNames.length==0)
				fieldNames = fields;
			json2csv({data:formatData,fields: fields,hasCSVColumnTitle:!skipHeader,fieldNames:fieldNames, del: colSep},function(err,csv){
				if(err)
					console.log(err)
                var content = encoding.convert(csv,encodingTo);
                res.attachment(exportFileName+'.csv');
                res.send(content);
				res.end();
			});
		}else if(format=="xml"){
			var obj = {name: resource,item: formatData};
			var builder = new xml2js.Builder();
			var xml = builder.buildObject(obj);
			res.attachment(exportFileName+'.xml');
            res.send(xml);
			res.end();
		}else if(format=="excel"){
			var conf ={};
			var rows = []
			//conf.stylesXmlFile = "styles.xml";
			conf.cols = [];
			_.each(fieldNamesArr,function(fieldName){
				conf.cols.push({
					caption:fieldName,
					type:'string'              
				})
			})
			_.each(formatData,function(row){
				rows.push(_.values(row))
			})
			conf.rows = rows;
			var result = nodeExcel.execute(conf);
			res.setHeader('Content-Type', 'application/vnd.openxmlformats');
			//res.setHeader("Content-Disposition", "attachment; filename=" +exportFileName+ ".xlsx");
			res.attachment(exportFileName+'.xlsx');
			res.end(result, 'binary');
		}
		

	})
	
}


