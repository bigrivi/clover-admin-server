const querystring = require('querystring');
const helper = require('think-helper');


/**
 * ip转数字
 * @param ip
 * @returns {number}
 * @private
 */
global._ip2int = function(ip) {
  var num = 0;
  ip = ip.split('.');
  num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
  num = num >>> 0;
  return num;
};
/**
 * 数字转ip
 * @param num
 * @returns {string|*}
 * @private
 */
global._int2iP = function(num) {
  var str;
  var tt = new Array();
  tt[0] = (num >>> 24) >>> 0;
  tt[1] = ((num << 8) >>> 24) >>> 0;
  tt[2] = (num << 16) >>> 24;
  tt[3] = (num << 24) >>> 24;
  str = String(tt[0]) + '.' + String(tt[1]) + '.' + String(tt[2]) + '.' + String(tt[3]);
  return str;
};

/**
 * 密码加密
 * @param password 加密的密码
 * @param md5encoded true-密码不加密，默认加密
 * @returns {*}
 */
global.encryptPassword = function(password, md5encoded) {
  md5encoded = md5encoded || false;
  password = md5encoded ? password : think.md5(password);
  return think.md5(think.md5('cloveradmin') + password + think.md5('andy'));
};

/**
 * 数组去重
 * @param arr
 * @returns {Array}
 */
global.unique = function(arr) {
  // var result = [], hash = {};
  // for (var i = 0, elem; (elem = arr[i]) != null; i++) {
  //     if (!hash[elem]) {
  //         result.push(elem);
  //         hash[elem] = true;
  //     }
  // }
  // return result;
  return Array.from(new Set(arr));
};
/**
 * in_array
 * @param stringToSearch
 * @param arrayToSearch
 * @returns {boolean}
 */
global.in_array = function(stringToSearch, arrayToSearch) {
  for (let s = 0; s < arrayToSearch.length; s++) {
    const thisEntry = arrayToSearch[s].toString();
    if (thisEntry == stringToSearch) {
      return true;
    }
  }
  return false;
};
/**
 * global times
 * 时间格式化
 * @param d
 * @returns {string}
 */
global.times = function(d, sec) {
  var time;
  var date = new Date(d);
  var y = date.getFullYear();
  var M = date.getMonth() + 1;
  M = M < 10 ? '0' + M : M;
  var d = date.getDate();
  d = d < 10 ? '0' + d : d;
  var h = date.getHours();
  h = h < 10 ? '0' + h : h;
  var m = date.getMinutes();
  m = m < 10 ? '0' + m : m;
  var s = date.getSeconds();
  s = s < 10 ? '0' + s : s;
  if (sec) {
    time = y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
  } else {
    time = y + '-' + M + '-' + d + ' ' + h + ':' + m;
  }

  return time;
};

/**
 * 排序函数
 */
function sort_node(v, w) {
  return v['sort'] - w['sort'];
}
function sort_node1(v, w) {
  return w['sort'] - v['sort'];
}

/**
 * obj_values(obj);
 * 获取对象中的所有的值，并返回数组
 * @param obj
 * @returns {Array}
 */
/* global obj_values */
global.obj_values = function(obj) {
  const objkey = Object.keys(obj);
  const objarr = [];
  objkey.forEach(key => {
    objarr.push(obj[key]);
  });
  return objarr;
};
/**
 * 判断对象是否相等
 * @param a
 * @param b
 * @returns {boolean}
 */
/* global isObjectValueEqual */
global.isObjectValueEqual = function(a, b) {
  // Of course, we can do it use for in
  // Create arrays of property names
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
};
/**
 * trim()
 * @param str [删除左右两端的空格]
 * @returns {*|void|string|XML}
 */
/* global trim */
global.trim = function(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '');
};
/**
 * 分析枚举类型配置值 格式 a:名称1,b:名称2
 * @param str
 * @returns {*}
 */
/* global parse_config_attr */
global.parse_config_attr = function(str, sep = ':') {
  let strs;
  if (str.search(/\r\n/ig) > -1) {
    strs = str.split('\r\n');
  } else if (str.search(/,/ig) > -1) {
    strs = str.split(',');
  } else if (str.search(/\n/ig) > -1) {
    strs = str.split('\n');
  } else {
    strs = [str];
  }
  if (think.isArray(strs)) {
    const obj = {};
    strs.forEach(n => {
      n = n.split(sep);
      obj[n[0]] = n[1];
    });
    return obj;
  }
};
global.parse_type_attr = function(str) {
  let strs;
  if (str.search(/\r\n/ig) > -1) {
    strs = str.split('\r\n');
  } else if (str.search(/,/ig) > -1) {
    strs = str.split(',');
  } else if (str.search(/\n/ig) > -1) {
    strs = str.split('\n');
  } else {
    strs = [str];
  }
  if (think.isArray(strs)) {
    const arr = [];
    for (let v of strs) {
      const obj = {};
      v = v.split(':');
      if (!think.isEmpty(v[0]) && !think.isEmpty(v[1])) {
        obj.id = v[0];
        obj.name = v[1];
        if (obj.id.split('.').length == 1) {
          obj.pid = 0;
        } else {
          obj.pid = obj.id.split('.').splice(0, obj.id.split('.').length - 1).join('.');
        }
        arr.push(obj);
      }
    }
    // console.log(arr);
    const tree = arr_to_tree(arr, 0);
    // think.log(tree);
    return tree;
  }
};
/**
 * ltrim()
 * @param str [删除左边的空格]
 * @returns {*|void|string|XML}
 */
/* global ltrim */
global.ltrim = function(str) {
  return str.replace(/(^\s*)/g, '');
};
/**
 *
 * rtrim()
 * @param str [删除右边的空格]
 * @returns {*|void|string|XML}
 */
/* global rtrim */
global.rtrim = function(str) {
  return str.replace(/(\s*$)/g, '');
};




/**
 * 时间戳格式化 dateformat()
 * @param extra 'Y-m-d H:i:s'
 * @param date  时间戳
 * @return  '2015-12-17 15:39:44'
 */
/* global dateformat */
global.dateformat = function(extra, date) {
  const D = new Date(date);
  const time = {
    'Y': D.getFullYear(),
    'm': D.getMonth() + 1,
    'd': D.getDate(),
    'H': D.getHours(),
    'i': D.getMinutes(),
    's': D.getSeconds()
  };
  const key = extra.split(/\W/);
  let _date;
  for (const k of key) {
    time[k] = time[k] < 10 ? '0' + time[k] : time[k];
    _date = extra.replace(k, time[k]);
    extra = _date;
  }
  return _date;
};
/* global array_search */
global.array_search = function(arr, str) {
  // 如果可以的话，调用原生方法
  if (arr && arr.indexOf) {
    return arr.indexOf(str);
  }

  var len = arr.length;
  for (var i = 0; i < len; i++) {
    // 定位该元素位置
    if (arr[i] == str) {
      return i;
    }
  }

  // 数组中不存在该元素
  return false;
};
/* global array_diff */
global.array_diff = function(arr1, arr2) {
  // var arr1 = ["i", "b", "c", "d", "e", "f","x",""]; //数组A
  // var arr2 = ["a", "b", "c", "d", "e", "f", "g"];//数组B
  var temp = []; // 临时数组1
  var temparray = [];// 临时数组2
  for (var i = 0; i < arr2.length; i++) {
    temp[arr2[i]] = true;// 巧妙地方：把数组B的值当成临时数组1的键并赋值为真
  }
  for (var i = 0; i < arr1.length; i++) {
    if (!temp[arr1[i]]) {
      temparray.push(arr1[i]);// 巧妙地方：同时把数组A的值当成临时数组1的键并判断是否为真，如果不为真说明没重复，就合并到一个新数组里，这样就可以得到一个全新并无重复的数组
    }
  }
  ;
  // if(think.isEmpty(temparray)){
  //    return
  // }
  return temparray;
};




// 时间格式
/* global time_format */
global.time_format = (time) => {
  return dateformat('Y-m-d H:i:s', time);
};
/* global str_replace()
 * str_replace(条件[]，替换内容[],被替换的内容)
 * @param search
 * @param replace
 * @param subject
 * @param count
 * @returns {*}
 */
/* global str_replace */
global.str_replace = function(search, replace, subject, count) {
  var i = 0, j = 0, temp = '', repl = '', sl = 0, fl = 0,
    f = [].concat(search),
    r = [].concat(replace),
    s = subject,
    ra = r instanceof Array, sa = s instanceof Array;
  s = [].concat(s);
  if (count) {
    this.window[count] = 0;
  }

  for (i = 0, sl = s.length; i < sl; i++) {
    if (s[i] === '') {
      continue;
    }
    for (j = 0, fl = f.length; j < fl; j++) {
      temp = s[i] + '';
      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
      s[i] = (temp).split(f[j]).join(repl);
      if (count && s[i] !== temp) {
        this.window[count] += (temp.length - s[i].length) / f[j].length;
      }
    }
  }
  return sa ? s : s[0];
};
/**
 * 获取文档地址
 * @param name 文档表示
 * @param id   文档id
 * @returns {*}
 */
global.get_url = (name, id) => {
  if (!think.isEmpty(name)) {
    return `/p/${name}.html`;
  } else {
    return `/p/${id}.html`;
  }
};
global.get_pdq = (id) => {
  return parse_config_attr(think.config('ext.attachment.pdn'), '@')[id];
};
/**
 * 获取文档封面图片
 * @param int cover_id
 * @param string field
 * @return 完整的数据  或者  指定的field字段值
 * @author arterli <arterli@qq.com>
 */
/* global get_cover */
global.get_cover = async(cover_id, field) => {
  if (think.isEmpty(cover_id)) {
    return false;
  }
  const picture = await think.model('ext_attachment_pic').where({ 'status': 1 }).find(cover_id);
  return think.isEmpty(field) ? picture : picture[field];
};

// {present_price:100,discount_price:80}
global.formatprice = function(price) {
  const pr = JSON.parse(price);
  var present_price;
  // console.log(pr);
  if (think.isNumber(pr.present_price)) {
    pr.present_price = pr.present_price.toString();
  }
  var price = pr.present_price.split('-');
  if (price.length > 1) {
    present_price = formatCurrency(price[0]) + '-' + formatCurrency(price[1]);
  } else {
    present_price = formatCurrency(price[0]);
  }
  if (pr.discount_price == 0) {
    return `<span class="text-xs"><span class="text-danger">现价:￥${present_price}</span></span>`;
  } else {
    return `<span class="text-xs"><span class="text-danger">现价:￥${present_price}</span> <br>原价:￥${formatCurrency(pr.discount_price)}</span>`;
  }
};



/**
 * 将数值四舍五入(保留2位小数)后格式化成金额形式
 *
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.45'
 * @type String
 */
/* global formatCurrency */
global.formatCurrency = function(num) {
  num = num.toString().replace(/\$|\,/g, '');
  if (isNaN(num)) { num = '0' }
  const sign = (num == (num = Math.abs(num)));
  num = Math.floor(num * 100 + 0.50000000001);
  let cents = num % 100;
  num = Math.floor(num / 100).toString();
  if (cents < 10) { cents = '0' + cents }
  for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
    num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
  }
  return (((sign) ? '' : '-') + num + '.' + cents);
};

/**
 * 将数值四舍五入(保留1位小数)后格式化成金额形式
 *
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.4'
 * @type String
 */
/* global formatCurrencyTenThou */
global.formatCurrencyTenThou = function(num) {
  num = num.toString().replace(/\$|\,/g, '');
  if (isNaN(num)) { num = '0' }
  const sign = (num == (num = Math.abs(num)));
  num = Math.floor(num * 10 + 0.50000000001);
  const cents = num % 10;
  num = Math.floor(num / 10).toString();
  for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
    num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
  }
  return (((sign) ? '' : '-') + num + '.' + cents);
};
/**
 * 获取商品suk suk, arr:类型数组
 */


/**
 * 验证是否为智能手机
 * @ param {string} data :this.userAgent;
 * @ return {bool}
 */
/** global checkMobile */
global.checkMobile = function(agent) {
  let flag = false;
  agent = agent.toLowerCase();
  const keywords = ['android', 'iphone', 'ipod', 'ipad', 'windows phone', 'mqqbrowser'];

  // 排除 Windows 桌面系统
  if (!(agent.indexOf('windows nt') > -1) || (agent.indexOf('windows nt') > -1 && agent.indexOf('compatible; msie 9.0;') > -1)) {
    // 排除苹果桌面系统
    if (!(agent.indexOf('windows nt') > -1) && !agent.indexOf('macintosh') > -1 && !(agent.indexOf('ipad') > -1)) {
      for (const item of keywords) {
        if (agent.indexOf(item) > -1) {
          flag = true;
          break;
        }
      }
    }
  }
  return flag;
};
/**
 * 验证时否是微信
 *
 */
global.is_weixin = (agent) => {
  let flag = false;
  agent = agent.toLowerCase();
  // let key = ["mqqbrowser","micromessenger"];
  const key = ['micromessenger'];
  // 排除 Windows 桌面系统
  if (!(agent.indexOf('windows nt') > -1) || (agent.indexOf('windows nt') > -1 && agent.indexOf('compatible; msie 9.0;') > -1)) {
    // 排除苹果桌面系统
    if (!(agent.indexOf('windows nt') > -1) && !agent.indexOf('macintosh') > -1) {
      for (const item of key) {
        if (agent.indexOf(item) > -1) {
          flag = true;
          break;
        }
      }
    }
  }
  return flag;
};
/**
 *
 * @param time
 * @returns {string}'January 31, 2018 15:03:26'
 */
global.date_from = (time) => {
  // January 31, 2018 15:03:26
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const d = new Date(time);
  const month = months[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  const hour = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours();
  const min = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
  const sec = d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds();
  const res = `${month} ${day}, ${year} ${hour}:${min}:${sec}`;
  return res;
};

global.image_view = (str, w, m) => {
  // console.log(info);
  const imgReg = /<img.*?(?:>|\/>)/gi;
  const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
  const arr = str.match(imgReg);
  if (!think.isEmpty(arr)) {
    const narr = [];
    for (const img of arr) {
      const _img = img.match(srcReg);
      // console.log(_img);
      const nimg = _img[1] + '?imageView2/' + m + '/w/' + w;
      // console.log(nimg)
      const inputimg = _img['input'].replace(_img[1], nimg);
      narr.push(inputimg);
    }
    return str_replace(arr, narr, str);
  } else {
    return str;
  }
};

/**
 * 获取文件信息
 * @param file_id 文件id
 * @param field 字段名,如果为空则返回整个记录集
 * @returns {*}
 */
global.get_file = async(file_id, field, key = false) => {
  if (think.isEmpty(file_id)) {
    return false;
  }
  const file = await think.model('ext_attachment_file').find(file_id);
  if (file.type > 0 && key && key !== 1) {
    file.savename = `${get_pdq(file.type)}/${file.savename}?download/${file.savename}`;
  } else if (file.type > 0 && key === 1) {
    file.savename = `${get_pdq(file.type)}/${file.savename}`;
  } else {
    file.savename = `${file.savepath}/${file.savename}`;
  }
  return think.isEmpty(field) ? file : file[field];
};

/*
 *比较数组是否完全相同
 */
global.a2a = function(a1, a2) {
  if (!(think.isArray(a1) && think.isArray(a2))) {
    return false;
  }
  if (a1.length != a2.length) {
    return false;
  }

  a1.sort();
  a2.sort();
  for (var i = 0; i < a1.length; i++) {
    if (typeof a1[i] !== typeof a2[i]) {
      return false;
    }
    if (think.isObject(a1[i]) && think.isObject(a2[i])) {
      var retVal = o2o(a1[i], a2[i]);
      if (!retVal) {
        return false;
      }
    } else if (think.isArray(a1[i]) && think.isArray(a2[i])) { // recursion
      if (!a2a(a1[i], a2[i])) {
        return false;
      }
    } else if (a1[i] !== a2[i]) {
      return false;
    }
  }
  return true;
};
// 生成6位的随机数
global.MathRand = function() {
  var Num = '';
  for (var i = 0; i < 6; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  return Num;
};



global.GetDateStr = function(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount);// 获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1);// 获取当前月份的日期，不足10补0
  var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();// 获取当前几号，不足10补0
  return y + '-' + m + '-' + d;
};
// 转意符换成普通字符
global.escape2Html = function(str) {
  var arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'};
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) { return arrEntities[t] });
};
global.html_decode = function(str) {
  var s = '';
  if (str.length == 0) return '';
  s = str.replace(/&gt;/g, '&');
  s = s.replace(/&lt;/g, '<');
  s = s.replace(/&gt;/g, '>');
  s = s.replace(/&nbsp;/g, ' ');
  s = s.replace(/&#39;/g, "\'");
  s = s.replace(/&quot;/g, '"');
  s = s.replace(/<br>/g, '\n');
  return s;
};

global.html_encode = function(str) {
  var s = '';
  if (str.length == 0) return '';
  s = str.replace(/&/g, '&gt;');
  s = s.replace(/</g, '&lt;');
  s = s.replace(/>/g, '&gt;');
  s = s.replace(/ /g, '&nbsp;');
  s = s.replace(/\'/g, '&#39;');
  s = s.replace(/\"/g, '&quot;');
  s = s.replace(/\n/g, '<br>');
  return s;
};
/**
 * 检查pos(推荐位的值)是否包含指定推荐位contain
 * @param number pos 推荐位的值
 * @param number contain 指定推荐位
 * @return boolean true 包含 ， false 不包含
 */
global.check_document_position = (pos = 0, contain = 0) => {
  if(think.isEmpty(pos) || think.isEmpty(contain)){
    return false;
  }
  // 将两个参数进行按位与运算，不为0则表示$contain属于$pos
  const res = pos & contain;
  if (res !== 0){
    return true;
  }else{
    return false;
  }
}



global.getConnectString = function(config) {
    let connectionString = config.connectionString;
    if (!connectionString) {
      let auth = '';
      // connect with auth
      if (config.user) {
        auth = `${config.user}:${config.password}@`;
      }
      // connection options
      // http://mongodb.github.io/node-mongodb-native/2.0/tutorials/urls/
      let options = '';
      if (config.options) {
        options = '?' + querystring.stringify(config.options);
      }
      // many hosts
      let hostStr = '';
      if (helper.isArray(config.host)) {
        hostStr = config.host.map((item, i) => {
          return `${item}:${(config.port[i] || config.port[0])}`;
        }).join(',');
      } else {
        hostStr = config.host + ':' + config.port;
      }
      connectionString = `mongodb://${auth}${hostStr}/${config.database}${options}`;
    }
    return connectionString;
  }