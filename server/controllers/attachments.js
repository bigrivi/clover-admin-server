var fs = require("fs")
var tagModel = require('../models/tag');
var productModel = require('../models/product');
var AttachmentModel = require('../models/attachment');

exports.onDeleteBefore= function(req, res, next)
{
	var id = req.params.id
	AttachmentModel.findById(id,function(err,data){
		if(data){
			var filePath = data.real_url;
			fs.access(filePath, error => {
				if (!error) {
					fs.unlink(filePath,function(error){
						console.log(error);
					});
				} else {
					console.log(error);
				}
			});
		}
	})
	next();
}

exports.preview = function(req, res, next)
{
	var id = req.query.id
	AttachmentModel.findById(id,function(err,data){
		if(err)
		{
			res.json({ err:err  });
			return
		}
		fs.readFile(data.real_url, "binary", function(error, file) { 
			if(error) { 
			  res.writeHead(500, {"Content-Type": "text/plain"}); 
			  res.write(error + "\n"); 
			  res.end(); 
			} else { 
			  var desc = data['file_mime'].substr(0,5) == 'image' ? '' : 'attachment';
			  var disposition = desc+";filename="+encodeURI(data['source_name']);
			  console.log(disposition);
			  res.writeHead(200, {
				  "Content-Disposition":disposition,
				  "Content-Type": data.file_mime}); 
			  res.write(file, "binary"); 
			  res.end(); 
			} 
		  }); 
  
	})
}
