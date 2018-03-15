module.exports = class extends think.cloveradmin.rest {


     async putAction(){
        const AuthorizeModel = this.mongoose("authorize")
        var role_id = this.id
        var nodes = this.post("nodes")
        await AuthorizeModel.remove({auth_role_id:role_id})
        for(const auth_node_id of nodes){
            await AuthorizeModel.create({auth_node_id:auth_node_id,auth_role_id:role_id})
        }
        return this.success({})
    }

};
