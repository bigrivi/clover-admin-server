
module.exports = class extends think.cloveradmin.rest {
    constructor(ctx) {
        super(ctx);

    }


    __before() {
        if(this.ctx.isMethod("get")){
            //console.log("tag get")
        }
        else if(this.ctx.isMethod("post")){
            //console.log("tag post")
        }

        return Promise.resolve(super.__before()).then(data => {
            return data
        })

   }


   async _beforeInsert(){

   }


   async _beforeUpdate(){
        let productModel = this.mongoose("product")
        let count = await productModel.count({"tags":this.id})
        this.post("count",count)
   }



};
