

module.exports = class extends think.Service {
    constructor(ctx) {
        super(ctx);
    }

    async authenticate(username,password){
        let userModel = this.mongoose("user_info")
        let userInfo = await userModel.findOne({username:username}).exec()
        if(!userInfo){
            return -1
        }
        var hashed = await encryptPassword(password,true);
        console.log(hashed)
        if(hashed!==userInfo._doc.password_hash){
            return -2
        }
        return userInfo

    }


};
