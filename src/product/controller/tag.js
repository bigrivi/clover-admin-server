
module.exports = class extends think.cloveradmin.rest {
    constructor(ctx) {
        super(ctx);

    }


    __before() {
        return Promise.resolve(super.__before()).then(data => {
            return data
        })

   }


   async _beforeUpdate(){
        let productModel = this.mongoose("product")
        let count = await productModel.count({"tags":this.id})
        this.post("count",count)
   }



};
