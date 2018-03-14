module.exports = class extends think.cloveradmin.model {

    get schema() {
        return {
            real_url: 'string',
            source_name: 'string',
            file_size: 'number',
            file_mime: 'string',
            creation_on: 'date'
          }
    }


};


