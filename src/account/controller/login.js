module.exports = class extends think.cloveradmin.rest {
    constructor(ctx) {
        super(ctx);
    }

    async getAction(){
        let username = this.get("username")
        let password = this.get("password")
        const userService = this.service("user_info")
        const authService = this.service("authorize")
        let ret = await userService.authenticate(username,password)
        if(ret==-1){
            return this.fail("user not is exist")
        }
        if(ret==-2){
            return this.fail("invalid user password")
        }
        let session = await this.session('uid', ret._id);
        let auth_nodes = await authService.get_auth_nodes(ret._id)
        return this.success({token:session,user_info:ret,auth_nodes:auth_nodes})
    }

};
