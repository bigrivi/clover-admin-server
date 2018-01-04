var _ = require('underscore');
var fs = require('fs')
const crypto = require('crypto');
var AttachmentModel = require('../apps/uploader/models/attachment');
function decodeBase64File(fileType,dataString) {
  var response = {}
  response.type = fileType;
  response.data = new Buffer(dataString, 'base64');
  return response;
}

function saveFile(fileObject,cb){
	var ignore = [
            'exe', 'php', 'js', 'css', 'asp', 'aspx', 'pl', 'py', 'sh'
    ];
	var ext = fileObject.filename.substr(fileObject.filename.lastIndexOf(".")+1)
	if(ignore.indexOf(ext)>=0){
		cb(false)
		return;
	}
	var rnd = Math.round(Math.random()*1000)
	var fileName = crypto.createHash('md5').update(rnd.toString()).digest('hex');
	var fileBuffer = decodeBase64File(fileObject.filetype,fileObject.base64);
	var savePath = 'uploader/'+fileName+"."+ext;
	fs.writeFile(savePath, fileBuffer.data, function(err) { 
	  if(err) {
		cb(false)
	  } else {
		cb(savePath)
	  }
	});
	
}

exports = module.exports = function(req, res, next)
{
	var totalReplceNum = 0
	_.each(req.body,function(value,field){
		if(_.isArray(value)){
			if(value.length>0 && value[0].filetype && value[0].filename && value[0].filesize){
				totalReplceNum++;
			}
		}
	})
	if(totalReplceNum<=0)
	{
		next();
		return;
	}
	_.each(req.body,function(value,field){
		if(_.isArray(value)){
			if(value.length>0 && value[0].filetype && value[0].filename && value[0].filesize){
				var retIds = [];
				var total = value.length;
				var checkAllIsComplete = function(){
					if(total<=0){
						req.body[field] = retIds.join(",")
						next();
					}
				}
				_.each(value,function(fileObject){
					if(fileObject.id){
						retIds.push(fileObject.id)
						total--;
						checkAllIsComplete()
					}
					else{
						saveFile(fileObject,function(realFileUrl){
							if(realFileUrl){
								var saveData = {}
								saveData.real_url = realFileUrl
								saveData.source_name = fileObject.filename
								saveData.file_size = fileObject.filesize
								saveData.file_mime = fileObject.filetype
								saveData.creation_on = new Date();
								AttachmentModel.create(saveData, function (err, data) {
								  if (err) return console.log(err);
								  retIds.push(data._id)
								  total--;
								  checkAllIsComplete()
								})
							}
							else{
								total--;
								checkAllIsComplete()
							}
						});
					}
					
				})
				
			}
		}
	})
}