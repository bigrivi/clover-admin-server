module.exports = class extends think.cloveradmin.model {

    get schema() {
        return {
            name: 'string', //模板名称
            kind: 'string', //类型
            project: 'string', //调研项目
            status: 'number', //状态 0 禁用 1 启用
          }
    }


};
