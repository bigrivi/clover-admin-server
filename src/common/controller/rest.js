const assert = require('assert');
var path = require('path');
var yaml = require('js-yaml');
var sprintf = require("sprintf-js").sprintf


module.exports = class extends think.Controller {
  static get _REST() {
    return true;
  }

  constructor(ctx) {
    super(ctx);
    this.resource = this.getResource();
    this.id = this.getId();
    assert(think.isFunction(this.model), 'this.model must be a function');
    this.modelInstance = this.mongoose(this.resource);

  }
  async __before() {
    const uid = await this.session("uid")
    let whiteList = ["i18n","login","attachment"]
    if(this.ctx.method.toLowerCase()=="options" || whiteList.indexOf(this.ctx.controller)>=0){
      return true
    }
    else if(uid){
      const userModel = this.mongoose("user_info","account")
      const authService = this.service("authorize","account")
      this.userInfo = await userModel.findById(uid)
      //console.log(this.userInfo)
      this.authed_nodes = await authService.get_auth_nodes_by_roleid(this.userInfo.role_id)
      let current_action_all = sprintf("%s.%s.%s",this.ctx.module,think._.camelCase(this.ctx.controller),this.ctx.method.toLowerCase())
      think.logger.debug("current actio:",current_action_all)
      let allow_nodes = [
      "home.navs.get",
      "account.authorize.post",
      "account.authNode.get",
      "account.authorize.get"]

      if(this.authed_nodes.indexOf(current_action_all)>=0 || allow_nodes.indexOf(current_action_all)>=0)
        return true
      else{
        this.ctx.status = 401
        return false
      }

      return true
    }
    else{
      this.ctx.status = 401
      return false
    }
  }
  /**
   * get resource
   * @return {String} [resource name]
   */
  getResource() {
    return this.ctx.controller;
  }
  getId() {
    const id = this.get('id');
    if (id && (think.isString(id) || think.isNumber(id))) {
      return id;
    }
    const last = this.ctx.path.split('/').slice(-1)[0];
    if (last !== this.resource) {
      return last;
    }
    return '';
  }
  async getAction() {
    if (this.id) {
      await this.detailAction()
    }
    else{
      await this.listAction()
    }

  }


  async detailAction(){
    let data;
    var quer = this.modelInstance.findById(this.id);
    this.filter(quer)
    data = await quer.exec();
    if(this.get("limit") && this.get("skip")){
        var count = await quer.limit(0).skip(0).count()
        this.success({data:data,record_count:count});
    }
    else
      return this.success(data);
  }


  async listAction(){
    let data;
    var quer = this.modelInstance.find({})
    this.filter(quer)
    data = await quer.exec();
    if(this.get("limit") && this.get("skip")){
        var count = await quer.limit(0).skip(0).count()
        this.success({data:data,record_count:count});
    }
    else
      return this.success(data);
  }


  async filter(quer) {

    var query = function(key) {
      return function(val) {
        return quer[key](val);
      };
    }
    var coerceData = function(filter_func, data) {
        // Assume data is a string
        if (data && data.toLowerCase && data.toLowerCase() === 'true') {
          return true;
        } else if (data && data.toLowerCase && data.toLowerCase() === 'false') {
          return false;
        } else if (filter_func === 'limit' || filter_func === 'skip') {
          return parseInt(data);
        }
        return data;
      };

    var filterable = function(props, subfilters) {
        return {
          filter: function(key, val, quer) {
            if (props[key]) {
              return props[key](coerceData(key, val));
            }
            var field = key.split('__'),
              filter_func = field[1] || 'equals',
              data = coerceData(filter_func, val);

            if (filter_func === 'in' || filter_func === 'nin') {
              data = data.split(',');
            }

            //return quer.where(field[0])[filter_func](data)

            return subfilters[filter_func](data, quer.where(field[0]));
          },
          contains: function(key, quer) {
            if (key in props){
              return true;
            }
            var field = key.split('__');
            var filter_func = field[1] || 'equals';
            return field[0] in quer.model.schema.paths && filter_func in subfilters;
          }
        }
      }


    let valid_alterables = filterable({
      'populate': query('populate'),
    }, {});
    let valid_filters = filterable({
        'limit': query('limit'),
        'skip': query('skip'),
        'offset': query('offset'),
        'select': query('select'),
        'sort': query('sort'),
      }, {
        'equals': query('equals'),
        'gte': query('gte'),
        'gt': query('gt'),
        'lt': query('lt'),
        'lte': query('lte'),
        'ne': query('ne'),
        'regex': function(val, query) {
          var regParts = val.match(/^\/(.*?)\/([gim]*)$/);
          if (regParts) {
            val = new RegExp(regParts[1], regParts[2]);
          } else {
            val = new RegExp(val);
          }

          return query.regex(val);
        },
        'in': query('in'),
        'nin': query('nin'),
      });

    var alldata = [this.get()];
    alldata.forEach(function(alterableResponse) {
      Object.keys(alterableResponse).filter(function(potential) {
        return valid_alterables.contains(potential, quer);
      }).forEach(function(valid_key) {
        query = valid_alterables.filter(valid_key, alterableResponse[valid_key], quer);
      });
    });

    if(!this.id){
        alldata.forEach(function(alterableResponse) {
          Object.keys(alterableResponse).filter(function(potential) {
            return valid_filters.contains(potential, quer);
          }).forEach(function(valid_key) {
            query = valid_filters.filter(valid_key, alterableResponse[valid_key], quer);
          });
        });
    }



    return quer;
  }


  /**
   * put resource
   * @return {Promise} []
   */
  async postAction() {
    await this._beforeInsert()
    const pk = this.modelInstance.pk;
    const data = this.post();
    delete data[pk];
    if (think.isEmpty(data)) {
      return this.fail('data is empty');
    }
    const res = await this.modelInstance.create(data);
    this._afterInsert(res._id)
    return this.success(res);
  }
  /**
   * delete resource
   * @return {Promise} []
   */
  async deleteAction() {
    if (!this.id) {
      return this.fail('params error');
    }
    const pk = this.modelInstance.pk;
    await this._beforeDelete(this.id)
    const ret = await this.modelInstance.findById(this.id)
    if(!ret){
      return this.fail("object not found")
    }
    await ret.remove()
    await this._afterDelete(this.id)
    this.success(ret)
  }
  /**
   * update resource
   * @return {Promise} []
   */
  async putAction() {
    if (!this.id) {
      return this.fail('params error');
    }
    await this._beforeUpdate()
    const pk = this.modelInstance.pk;
    const data = this.post();
    delete data[pk];
    if (think.isEmpty(data)) {
      return this.fail('data is empty');
    }
    const info = await this.modelInstance.findById(this.id)
    if(!info){
      return this.fail("object not found")
    }
    info.set(data)
    await info.save()
    await this._afterUpdate()
    return this.success(info)
  }

  async _beforeInsert(){

  }

  async _afterInsert(id){

  }

  async _beforeUpdate(){

  }

  async _afterUpdate(id){

  }

  async _afterDelete(id){

  }

  async _beforeDelete(id){

  }


   setCorsHeader(){
    this.header("Access-Control-Allow-Origin", this.header("origin") || "*");
    this.header("Access-Control-Allow-Headers", "x-requested-with");
    this.header("Access-Control-Request-Method", "GET,POST,PUT,DELETE");
    this.header("Access-Control-Allow-Credentials", "true");
  }





  __call() {
    let method = this.ctx.method.toLowerCase();
    console.log("unfound")
    if(method === "options"){
      this.setCorsHeader();
      this.ctx.res.end();
      return;
    }
    this.setCorsHeader();
    return super.__call();
  }
};