module.exports = class extends think.cloveradmin.model {

    get schema() {
        return {
               name: 'string',
               enabled_status: 'number',
               research_status: 'number'
          }
    }


};


