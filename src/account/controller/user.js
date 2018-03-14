module.exports = class extends think.cloveradmin.rest {

    __before() {
        return Promise.resolve(super.__before()).then(data => {
            return data
        })

   }


   async _beforeInsert(){
        var hashed = encryptPassword(this.post("password_hash"),true);
        this.ctx.post("creation_on",new Date())
        this.ctx.post("password_hash",hashed)
   }

};
