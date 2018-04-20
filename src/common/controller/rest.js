const assert = require('assert');
const mongoose = require('mongoose');

var path = require('path');
var yaml = require('js-yaml');
var sprintf = require("sprintf-js").sprintf

var json2csv = require('json2csv');
var encoding = require('encoding');
var xml2js = require('xml2js');
var nodeExcel = require('excel-export');

const json2csv2 = think.promisify(json2csv, json2csv);


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
    this.api_version = this.ctx.headers["version"]?this.ctx.headers["version"].replace(/\./g,""):""

  }
  async __before() {
    this.setCorsHeader();
    const uid = await this.session("uid")
    console.log("sessionId",uid)
    let whiteList = ["i18n","login","attachment","region","heartbeart"]
    let current_action_all = sprintf("%s.%s.%s",this.ctx.module,think._.camelCase(this.ctx.controller),this.ctx.action.toLowerCase())
    think.logger.debug("current actio:",current_action_all)
    if(this.ctx.method.toLowerCase()=="options" || whiteList.indexOf(this.ctx.controller)>=0){
      return true
    }
    else if(uid){
      const userModel = this.mongoose("user_info","account")
      const authService = this.service("authorize","account")
      this.userInfo = await userModel.findById(uid)
      let newToken = await this.session('uid', uid);
      this.ctx.res.setHeader("Token",newToken)
      this.authed_nodes = await authService.get_auth_nodes_by_roleid(this.userInfo.role_id)
      let allow_nodes = [
      "home.navs.get",
      "dataModel.parameter.get",
      "dataModel.parameter.put",
      "dataModel.parameter.post",
      "dataModel.parameter.delete",
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
   if(this.api_version && this.apiMethodIsExist("detailAction")){
      return await this["detailAction_"+this.api_version]()
    }
    let data;
    var quer = this.modelInstance.findById(this.id);
    this.filter(quer)
    data = await quer.exec();
    if(this.methodIsExist("_beforeItemResponse")){
      await this._beforeItemResponse(data)
    }
    return this.success(data);
  }


  async listAction(){
    if(this.api_version && this.apiMethodIsExist("listAction")){
      return await this["listAction_"+this.api_version]()
    }
    await this._beforeList()
    let data;
    var quer
    let searchKeyword = this.get("searchKeyword")
    if(searchKeyword && this.get("searchOrFields")){
      let orFields = this.get("searchOrFields").split(' ')
      let findWhere = []
      orFields.forEach(function(field){
        let obj = {}
        obj[field] = new RegExp(searchKeyword,"i")
        findWhere.push(obj);
      })
      quer = this.modelInstance.find({"$or" :findWhere})
    }
    else
      quer = this.modelInstance.find({})

    this.filter(quer)
    data = await quer.exec();
    if(this.methodIsExist("_beforeListResponse")){
      await this._beforeListResponse(data)
    }
    if(this.get("limit") && this.get("skip")){
        var count = await quer.limit(0).skip(0).count()
        this.success({data:data,record_count:count});
    }
    else
      return this.success(data);
  }

  apiMethodIsExist(methodName){
    return !!this[methodName+"_"+this.api_version]
  }


  methodIsExist(methodName){
    return !!this[methodName]
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
   if(this.api_version && this.apiMethodIsExist("postAction")){
      return await this["postAction_"+this.api_version]()
    }
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
   if(this.api_version && this.apiMethodIsExist("deleteAction")){
      return await this["deleteAction_"+this.api_version]()
    }
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
    if(this.api_version && this.apiMethodIsExist("putAction")){
      return await this["putAction_"+this.api_version]()
    }
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

  async exportAction(){
    var format = this.get("format") //导出格式，csv/excel/json/xml
    var resource = this.get("resource") //导出模型
    var app = this.get("app") //所在app
    var fields = this.get("fields"); //导出字段
    var encodingTo = this.get("encodingTo") || "GB2312"; //csv编码格式
    var fieldNames = this.get("fieldNames") || ""; //导出字段名
    var colSep = this.get("colSep") || ",";
    var sortField = this.get("sortField") || "_id"; //排序字段
    var sort = this.get("sort") || "desc"; //排序
    var skipHeader = this.get("skipHeader") || true; //不显示表格头
    var fieldsArr = fields.split(",");
    var fieldNamesArr = fieldNames.split(",");
    var populates = this.get("populates") || "";//category_id,tags
    var populatesArr = populates.split(",")
    var exportFileName = resource
    var selects = {}
    think._.each(fieldsArr,function(item){
      selects[item] = 1
    })
    var sortOption = {}
    if(sort=="asc")
      sortOption[sortField] = 1;
    else
      sortOption[sortField] = -1;
    let modelInstance = this.mongoose(this.get("resource"));
    let where = {}

    //gender__equals=male
    let getData = this.get()
    think._.each(getData,function(value,key){
        if(key.indexOf("__equals")>=0){
          let matchField = key.replace("__equals","")
          where[matchField] = value
        }
    })

    var model = modelInstance.find(where,selects,{sort:sortOption})
    think._.each(populatesArr,function(item){
      model.populate({path: item,select: 'name-_id'})
    })
    let dataList = await model.exec()
    //format
    var formatData = think._.map(dataList,function(row){
      var formatRow = {};
      think._.each(fieldsArr,function(fieldName){
        //console.log(fieldName)
        var fieldData = row[fieldName];
        var isType = mongoose.Types.ObjectId.isValid(fieldData);
        if(think._.isArray(fieldData))
          fieldData = think._.map(fieldData,function(item){return item.name||item}).join(",")
        else if(think._.isObject(fieldData) && fieldName!="_id"){
          fieldData = fieldData["name"] || fieldData;
          if(fieldName==="creation_on"){
            fieldData = dateformat('Y-m-d H:i:s',fieldData)
          }
        }else if(fieldName=="_id"){
          fieldData = String(row["_id"])
        }

        formatRow[fieldName] = fieldData
      })
      return formatRow
    })

    if(format=="json"){
      this.ctx.attachment(exportFileName+'.json');
      this.ctx.body = formatData
    }
    else if(format == "csv"){
        var fields = fieldsArr;
        var fieldNames = fieldNamesArr;
        if(fieldNames.length==0)
          fieldNames = fields;
        var csvData = await json2csv2({data:formatData,fields: fields,hasCSVColumnTitle:!skipHeader,fieldNames:fieldNames, del: colSep})
        this.ctx.attachment(exportFileName+'.csv');
        this.ctx.body = csvData
    }else if(format=="xml"){
        var obj = {name: resource,item: formatData};
        var builder = new xml2js.Builder();
        var xml = builder.buildObject(obj);
        this.ctx.attachment(exportFileName+'.xml');
        this.ctx.body=xml;
    }else if(format=="excel"){
        var conf ={};
        var rows = []
        conf.cols = [];
        think._.each(fieldNamesArr,function(fieldName){
          conf.cols.push({
            caption:fieldName,
            type:'string'
          })
        })
        think._.each(formatData,function(row){
          rows.push(think._.values(row))
        })
        conf.rows = rows;
        var result = nodeExcel.execute(conf);
        //this.header('Content-Type', 'application/vnd.openxmlformats');
        //this.header("Content-Disposition", "attachment; filename=" +exportFileName+".xlsx");
        this.ctx.type = "application/vnd.openxmlformats"
        this.ctx.attachment(exportFileName+'.xlsx');
        this.ctx.body=new Buffer(result,'binary');

    }


  }

  async _beforeList(){

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
    this.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Token,language,accesstoken");
    this.header("Access-Control-Request-Method", "GET,POST,PUT,DELETE");
    this.header("Access-Control-Allow-Credentials", "true");
    this.header("Access-Control-Expose-Headers", "*");


  }





  __call() {
    let method = this.ctx.method.toLowerCase();
    if(method === "options"){
      this.setCorsHeader();
      this.ctx.res.end();
      return;
    }
    this.setCorsHeader();
  }
};