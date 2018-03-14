var _ = require('underscore');
var fs = require('fs')
const crypto = require('crypto');



const decodeBase64File = function(fileType,dataString) {
  var response = {}
  response.type = fileType;
  response.data = new Buffer(dataString, 'base64');
  return response;
}


const saveFile = function(fileObject){
    var ignore = [
            'exe', 'php', 'js', 'css', 'asp', 'aspx', 'pl', 'py', 'sh'
    ];
    var ext = fileObject.filename.substr(fileObject.filename.lastIndexOf(".")+1)
    if(ignore.indexOf(ext)>=0){
        return Promise.resolve(false)
    }
    var rnd = Math.round(Math.random()*1000)
    var fileName = crypto.createHash('md5').update(rnd.toString()).digest('hex');
    var fileBuffer = decodeBase64File(fileObject.filetype,fileObject.base64);
    var savePath = 'www/uploader/'+fileName+"."+ext;
    return new Promise((resolve,reject)=>{
        fs.writeFile(savePath, fileBuffer.data, function(err) {
          if(err) {
            resolve(false)
          } else {
            resolve(savePath.replace("www/",""))
          }
    });
    })

}



module.exports = options => {
  return async (ctx, next) => {
    //ctx.state.userInfo = {name:"andy"}
    let postData = ctx.post()
    const attachmentModel = ctx.mongoose("attachment","uploader")
    var rnd = Math.round(Math.random()*1000)
    var fileName = crypto.createHash('md5').update(rnd.toString()).digest('hex');
    //console.log(postData)
    var totalReplceNum = 0
    _.each(postData,function(value,field){
        if(_.isArray(value)){
            if(value.length>0 && value[0].filetype && value[0].filename && value[0].filesize){
                totalReplceNum++;
            }
        }
    })
    if(totalReplceNum<=0)
    {
        return next();
    }
    else{
        let fields = Object.keys(postData)
        for(const fieldItem of fields){
            let values = postData[fieldItem]
            if(_.isArray(values)){
                if(values.length>0 && values[0].filetype && values[0].filename && values[0].filesize){
                    var retIds = [];
                    var total = values.length;
                    for(const fileObject of values){
                        if(fileObject.id){
                            retIds.push(fileObject.id)
                        }
                        else{
                            let realFileUrl = await saveFile(fileObject)
                            if(realFileUrl){
                                var saveData = {}
                                saveData.real_url = realFileUrl
                                saveData.source_name = fileObject.filename
                                saveData.file_size = fileObject.filesize
                                saveData.file_mime = fileObject.filetype
                                saveData.creation_on = new Date();
                                let ret = await attachmentModel.create(saveData)
                                retIds.push(ret._id)
                            }
                        }
                    }
                    ctx.post(fieldItem,retIds.join(","))
                    //console.log(ctx.post())
                    //console.log("retIds:"+retIds)

                }
            }
        }
        return next();
    }
  }
}