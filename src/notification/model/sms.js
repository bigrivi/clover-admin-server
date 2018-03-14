module.exports = class extends think.cloveradmin.model {

    get schema() {
        return {
            active_name: 'string', //调研互动名称
            template_name: 'string', //模板名称
            pici: 'string', //批次
            sended_total: 'number', //发送总量
            sended_success: 'number', //发送成功
            sending_total: 'number' //发送中
          }
    }


};
