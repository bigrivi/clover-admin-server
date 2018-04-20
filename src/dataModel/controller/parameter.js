module.exports = class extends think.cloveradmin.rest {
    async _beforeList(){
        const uid = await this.session("uid")
        this.get("created__equals",uid)
    }


    async postAction(){
        const ParameterModel = this.mongoose("parameter")
        var role_id = this.id
        var group = this.post("group")
		var keepValue = this.post("keepValue")
		console.log("keepValue=>",keepValue)
        const uid = await this.session("uid")
        var parameters = this.post("parameters")
		if(keepValue)
			await ParameterModel.remove({"group":group,"created":uid,"_id":{"$ne":keepValue}})
		else
			await ParameterModel.remove({"group":group,"created":uid})
        for(const parameterItem of parameters){
			if(parameterItem.value == keepValue && keepValue!=""){
				//update
				const info = await ParameterModel.findById(parameterItem.value)
				if(info){
					info.set(parameterItem)
					await info.save()
				}
			}
			else{
				parameterItem.created = uid;
				await ParameterModel.create(parameterItem)
			}
            
        }
        return this.success({})
    }
};
