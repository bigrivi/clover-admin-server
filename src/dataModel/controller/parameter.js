module.exports = class extends think.cloveradmin.rest {
    async _beforeList(){
        const uid = await this.session("uid")
        this.get("created__equals",uid)
    }


    async postAction(){
        const ParameterModel = this.mongoose("parameter")
        var role_id = this.id
        var group = this.post("group")
        const uid = await this.session("uid")
        var parameters = this.post("parameters")
        await ParameterModel.remove({group:group})
        for(const parameterItem of parameters){
            parameterItem.created = uid;
            await ParameterModel.create(parameterItem)
        }
        return this.success({})
    }
};
