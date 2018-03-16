module.exports = class extends think.cloveradmin.model {

    get schema() {
        return {
             product_id:{ type: 'ObjectId', ref: 'product' },
             customer:"string",
             quanity: 'number',
             reamrk:"string",
             order_date:'date'
          }
    }


};

