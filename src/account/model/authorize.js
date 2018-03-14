module.exports = class extends think.cloveradmin.model {

    get schema() {
        return {
             auth_node_id: { type: 'ObjectId', ref: 'auth_node' },
             auth_role_id:String
          }
    }


};
