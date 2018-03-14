module.exports = class extends think.cloveradmin.tree {
    get schema() {
        return {
             name: 'string',
             lft: 'number',
             rgt: 'number',
             depth: 'number',
             leader:{ type: 'ObjectId', ref: 'user_info' },
             description:'string'
          }
    }



};




