module.exports = class extends think.cloveradmin.model {

    get schema() {
        return {
               name: 'string',
               group:"string",
               ord: 'number',
               is_default: { type: 'number', default: 0 }//创建日期
          }
    }


};

