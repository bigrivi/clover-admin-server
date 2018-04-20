module.exports = class extends think.cloveradmin.model {

    get schema() {
        return {
               name: 'string',
               group:"string",
               ord: 'number',
               created: { type: 'ObjectId', ref: 'user' },//创建用户
               is_default: { type: 'number', default: 0 }//创建日期
          }
    }


};

