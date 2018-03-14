module.exports = class extends think.cloveradmin.model {

    get schema() {
        return {
               username: 'string',
               password_hash: 'string',
               realname: 'string',
               gender: 'string',
               hobby: 'string',
               email: 'string',
               department_id:{ type: 'ObjectId', ref: 'department' },
               role_id:{ type: 'ObjectId', ref: 'user_role' },
               creation_on: 'date',
               avatar: 'string'
          }
    }


};
