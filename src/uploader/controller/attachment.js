var fs = require("fs")

module.exports = class extends think.cloveradmin.rest  {
     async previewAction(){
        let id =this.get("id")
        let AttachmentModel = this.mongoose("attachment")
        let attachmentInfo;
        try{
            attachmentInfo = await AttachmentModel.findById(id)
        }catch(e){
            return this.fail("unfound the attachment")
        }
        let pic = fs.readFileSync("www/"+attachmentInfo.real_url)
        this.header("Content-Type",attachmentInfo.file_mime)
        return this.body = pic
    }


};
