var _ = require('lodash');

module.exports = class extends think.cloveradmin.rest {

    async getAction() {
       const uid = await this.session("uid")
       console.log(uid)
       let isLogin = uid?true:false
       return this.success({isLogin:isLogin});
    }
};
