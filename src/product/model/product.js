module.exports = class extends think.cloveradmin.model {

    get schema() {
        return {
                name: 'string',
                price:'number',
                measuring_unit:'string',
                model: 'string',
                producing_area:'string',
                serial_number:'string',
                bar_code:'string',
                category_id:{ type: 'ObjectId', ref: 'category' },
                creation_on:'date',
                introduction:'string',
                pic:'string',
                tags:[
                    {type:'ObjectId', ref: 'tag'}
                ]
          }
    }


};


