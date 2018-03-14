module.exports = class extends think.Logic {
    async __before() {
        if(this.isMethod("post")){
            let userModel = this.mongoose("account/user")
            let userInfo = await userModel.findOne({username:this.post("username")})
            if(userInfo){
                this.fail("exist user name "+this.post("username"))
                return false
            }
            return true

        }
   }



};
