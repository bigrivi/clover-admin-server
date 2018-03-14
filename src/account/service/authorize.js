

module.exports = class extends think.Service {
    constructor(ctx) {
        super(ctx);
    }

    async get_auth_nodes(uid){
        const user = this.mongoose("user_info")
        const authorize = this.mongoose("authorize")
        const user_info = await user.findById(uid)
        var auth_nodes = await authorize.find({auth_role_id:user_info.role_id}).populate("auth_node_id").exec()
        auth_nodes = auth_nodes.map((item)=>{
            return item.auth_node_id.node
        })
        return auth_nodes
    }

     async get_auth_nodes_by_roleid(role_id){
        const user = this.mongoose("user_info")
        const authorize = this.mongoose("authorize")
        var auth_nodes = await authorize.find({auth_role_id:role_id}).populate("auth_node_id").exec()
        auth_nodes = auth_nodes.map((item)=>{
            return item.auth_node_id.node
        })
        return auth_nodes
    }


};
