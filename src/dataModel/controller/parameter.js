module.exports = class extends think.cloveradmin.rest {

    async postAction(){
        const ParameterModel = this.mongoose("parameter")
        var role_id = this.id
        var group = this.post("group")
        var parameters = this.post("parameters")
        await ParameterModel.remove({group:group})
        for(const parameterItem of parameters){
            await ParameterModel.create(parameterItem)
        }
        return this.success({})
    }
};
